<?php

namespace App\Services\RouteFixAutomation\Fixers;

use App\Services\RouteFixAutomation\Models\FixResult;
use App\Services\RouteFixAutomation\Testing\ControllerTester;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class RepositoryInterfaceFixer
{
    private ControllerTester $controllerTester;
    
    private array $domainMappings = [
        'ADStool' => [
            'interfaces' => [
                'AccountRepositoryInterface' => 'App\Domains\ADStool\Domain\AccountRepositoryInterface',
                'ADSCampaignRepositoryInterface' => 'App\Domains\ADStool\Contracts\ADSCampaignRepositoryInterface',
                'CreativeRepositoryInterface' => 'App\Domains\ADStool\Domain\CreativeRepositoryInterface'
            ],
            'implementations' => [
                'AccountRepositoryInterface' => 'App\Domains\ADStool\Infrastructure\Persistence\Eloquent\AccountRepository',
                'ADSCampaignRepositoryInterface' => 'App\Domains\ADStool\Infrastructure\Persistence\Eloquent\ADSCampaignRepository',
                'CreativeRepositoryInterface' => 'App\Domains\ADStool\Infrastructure\Persistence\Eloquent\CreativeRepository'
            ],
            'serviceProvider' => 'Backend/app/Domains/ADStool/Providers/ADStoolDomainServiceProvider.php'
        ],
        'Analytics' => [
            'interfaces' => [
                'AnalyticReportRepositoryInterface' => 'App\Domains\Analytics\Domain\AnalyticReportRepositoryInterface'
            ],
            'implementations' => [
                'AnalyticReportRepositoryInterface' => 'App\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticReportRepository'
            ],
            'serviceProvider' => 'Backend/app/Domains/Analytics/Providers/AnalyticsDomainServiceProvider.php'
        ],
        'Media' => [
            'interfaces' => [
                'MediaRepositoryInterface' => 'App\Domains\Media\Contracts\MediaRepositoryInterface'
            ],
            'implementations' => [
                'MediaRepositoryInterface' => 'App\Domains\Media\Infrastructure\Persistence\Eloquent\MediaRepository'
            ],
            'serviceProvider' => 'Backend/app/Domains/Media/Providers/MediaDomainServiceProvider.php'
        ],
        'NodeRed' => [
            'interfaces' => [
                'NodeRedFlowRepositoryInterface' => 'App\Domains\NodeRed\Domain\NodeRedFlowRepositoryInterface'
            ],
            'implementations' => [
                'NodeRedFlowRepositoryInterface' => 'App\Domains\NodeRed\Infrastructure\Persistence\Eloquent\NodeRedFlowRepository'
            ],
            'serviceProvider' => 'Backend/app/Domains/NodeRed/Providers/NodeRedDomainServiceProvider.php'
        ],
        'Products' => [
            'interfaces' => [
                'LeadCaptureFormRepositoryInterface' => 'App\Domains\Products\Domain\LeadCaptureFormRepositoryInterface'
            ],
            'implementations' => [
                'LeadCaptureFormRepositoryInterface' => 'App\Domains\Products\Infrastructure\Persistence\Eloquent\LeadCaptureFormRepository'
            ],
            'serviceProvider' => 'Backend/app/Domains/Products/Providers/ProductsDomainServiceProvider.php'
        ],
        'Users' => [
            'interfaces' => [
                'UserRepositoryInterface' => 'App\Domains\Users\Contracts\UserRepositoryInterface',
                'UserPreferenceRepositoryInterface' => 'App\Domains\Users\Domain\UserPreferenceRepositoryInterface'
            ],
            'implementations' => [
                'UserRepositoryInterface' => 'App\Domains\Users\Infrastructure\Persistence\Eloquent\UserRepository',
                'UserPreferenceRepositoryInterface' => 'App\Domains\Users\Infrastructure\Persistence\Eloquent\UserPreferenceRepository'
            ],
            'serviceProvider' => 'Backend/app/Domains/Users/Providers/UsersDomainServiceProvider.php'
        ]
    ];

    public function __construct(ControllerTester $controllerTester)
    {
        $this->controllerTester = $controllerTester;
    }

    public function executeAll(bool $verbose = false, bool $dryRun = false): FixResult
    {
        $startTime = microtime(true);
        $fixedItems = [];
        $errors = [];

        try {
            // 1. Detectar interfaces faltantes
            $missingInterfaces = $this->findMissingInterfaces();
            
            if ($verbose) {
                echo "🔍 INTERFACES FALTANTES DETECTADAS:\n";
                if (empty($missingInterfaces)) {
                    echo "  • Nenhuma interface faltante detectada\n";
                    
                    // Debug: mostrar alguns erros de dependência
                    $testResult = $this->controllerTester->testAllControllers();
                    echo "  • Total de erros de dependência: " . count($testResult->dependencyErrors) . "\n";
                    if (!empty($testResult->dependencyErrors)) {
                        echo "  • Primeiros 3 erros:\n";
                        foreach (array_slice($testResult->dependencyErrors, 0, 3) as $error) {
                            echo "    - " . substr($error, 0, 100) . "...\n";
                        }
                    }
                } else {
                    foreach ($missingInterfaces as $domain => $interfaces) {
                        echo "  • {$domain}: " . count($interfaces) . " interfaces\n";
                    }
                }
            }

            // 2. Registrar interfaces nos service providers
            foreach ($missingInterfaces as $domain => $interfaces) {
                foreach ($interfaces as $interface) {
                    $result = $this->registerInterface($domain, $interface, $dryRun);
                    if ($result['success']) {
                        $fixedItems[] = $result['message'];
                    } else {
                        $errors[] = $result['message'];
                    }
                }
            }

            // 3. Criar implementações faltantes
            $createdImplementations = $this->createMissingImplementations($missingInterfaces, $dryRun);
            $fixedItems = array_merge($fixedItems, $createdImplementations);

            $executionTime = round(microtime(true) - $startTime, 2);

            return new FixResult(
                success: empty($errors),
                totalFixed: count($fixedItems),
                totalErrors: count($errors),
                fixedItems: $fixedItems,
                errors: $errors,
                executionTime: $executionTime
            );

        } catch (\Exception $e) {
            return new FixResult(
                success: false,
                totalFixed: count($fixedItems),
                totalErrors: 1,
                fixedItems: $fixedItems,
                errors: ["Erro geral: " . $e->getMessage()],
                executionTime: round(microtime(true) - $startTime, 2)
            );
        }
    }

    public function findMissingInterfaces(): array
    {
        $missingInterfaces = [];

        // 1. Análise proativa: examinar controllers diretamente
        $proactiveAnalysis = $this->analyzeControllerDependencies();
        
        // 2. Análise reativa: processar erros de teste
        $testResult = $this->controllerTester->testAllControllers();
        $reactiveAnalysis = $this->processTestErrors($testResult->dependencyErrors);
        
        // 3. Combinar ambas as análises
        $allAnalysis = array_merge_recursive($proactiveAnalysis, $reactiveAnalysis);
        
        // 4. Filtrar apenas interfaces que realmente não estão registradas
        foreach ($allAnalysis as $domain => $interfaces) {
            foreach ($interfaces as $interface) {
                if (!$this->isInterfaceRegistered($domain, $interface)) {
                    if (!isset($missingInterfaces[$domain])) {
                        $missingInterfaces[$domain] = [];
                    }
                    if (!in_array($interface, $missingInterfaces[$domain])) {
                        $missingInterfaces[$domain][] = $interface;
                    }
                }
            }
        }

        return $missingInterfaces;
    }

    private function analyzeControllerDependencies(): array
    {
        $dependencies = [];
        
        // Lista de controllers problemáticos conhecidos do routes_problems.md
        $problematicControllers = [
            'Backend/app/Domains/ADStool/Http/Controllers/AccountController.php',
            'Backend/app/Domains/ADStool/Http/Controllers/CampaignController.php',
            'Backend/app/Domains/ADStool/Http/Controllers/CreativeController.php',
            'Backend/app/Domains/Analytics/Http/Controllers/AnalyticsController.php',
            'Backend/app/Domains/Media/Http/Controllers/MediaController.php',
            'Backend/app/Domains/NodeRed/Http/Controllers/NodeRedController.php',
            'Backend/app/Domains/Products/Http/Controllers/Api/LeadCaptureFormController.php',
            'Backend/app/Domains/Users/Http/Controllers/Api/UserManagementController.php',
            'Backend/app/Domains/Users/Http/Controllers/ProfileController.php',
            'Backend/app/Domains/Users/Http/Controllers/UserPreferenceController.php',
        ];
        
        foreach ($problematicControllers as $controllerPath) {
            if (File::exists($controllerPath)) {
                $controllerDeps = $this->extractControllerDependencies($controllerPath);
                $dependencies = array_merge_recursive($dependencies, $controllerDeps);
            }
        }
        
        return $dependencies;
    }

    private function extractControllerDependencies(string $controllerPath): array
    {
        $content = File::get($controllerPath);
        $dependencies = [];
        
        // Extrair domínio do caminho
        if (preg_match('/app\/Domains\/(\w+)\//', $controllerPath, $matches)) {
            $domain = $matches[1];
            
            // Procurar por interfaces no construtor
            if (preg_match('/public function __construct\((.*?)\)/s', $content, $constructorMatches)) {
                $constructorParams = $constructorMatches[1];
                
                // Procurar por interfaces conhecidas
                if (isset($this->domainMappings[$domain])) {
                    foreach ($this->domainMappings[$domain]['interfaces'] as $shortName => $fullInterface) {
                        $interfaceBaseName = class_basename($fullInterface);
                        
                        // Verificar se a interface é usada no construtor
                        if (strpos($constructorParams, $interfaceBaseName) !== false) {
                            if (!isset($dependencies[$domain])) {
                                $dependencies[$domain] = [];
                            }
                            $dependencies[$domain][] = $shortName;
                        }
                    }
                }
            }
        }
        
        return $dependencies;
    }

    private function processTestErrors(array $dependencyErrors): array
    {
        $missingInterfaces = [];

        foreach ($dependencyErrors as $errorLine) {
            // Extrai o nome da interface do erro
            if (preg_match('/Target \[(.*?)\] is not instantiable/', $errorLine, $matches)) {
                $interfaceName = $matches[1];
                
                // Mapeia para o domínio correto
                foreach ($this->domainMappings as $domain => $config) {
                    foreach ($config['interfaces'] as $shortName => $fullInterface) {
                        if ($fullInterface === $interfaceName) {
                            if (!isset($missingInterfaces[$domain])) {
                                $missingInterfaces[$domain] = [];
                            }
                            if (!in_array($shortName, $missingInterfaces[$domain])) {
                                $missingInterfaces[$domain][] = $shortName;
                            }
                            break 2;
                        }
                    }
                }
            }
        }

        return $missingInterfaces;
    }

    private function isInterfaceRegistered(string $domain, string $interface): bool
    {
        if (!isset($this->domainMappings[$domain])) {
            return false;
        }

        $config = $this->domainMappings[$domain];
        $serviceProviderPath = $config['serviceProvider'];

        if (!File::exists($serviceProviderPath)) {
            return false;
        }

        $interfaceClass = $config['interfaces'][$interface];
        $content = File::get($serviceProviderPath);

        return strpos($content, $interfaceClass) !== false;
    }

    public function registerInterface(string $domain, string $interface, bool $dryRun = false): array
    {
        if (!isset($this->domainMappings[$domain])) {
            return [
                'success' => false,
                'message' => "Domínio {$domain} não mapeado"
            ];
        }

        $config = $this->domainMappings[$domain];
        $serviceProviderPath = $config['serviceProvider'];

        if (!File::exists($serviceProviderPath)) {
            return [
                'success' => false,
                'message' => "Service provider não encontrado: {$serviceProviderPath}"
            ];
        }

        $interfaceClass = $config['interfaces'][$interface];
        $implementationClass = $config['implementations'][$interface];

        $content = File::get($serviceProviderPath);

        // Verifica se já está registrado
        if (strpos($content, $interfaceClass) !== false) {
            return [
                'success' => true,
                'message' => "Interface {$interface} já registrada em {$domain}"
            ];
        }

        // Adiciona o bind no método register
        $bindLine = "        \$this->app->bind({$interfaceClass}::class, {$implementationClass}::class);";
        
        // Procura pelo método register e adiciona o bind
        $pattern = '/(public function register\(\).*?\{)(.*?)(\n    \})/s';
        
        if (preg_match($pattern, $content, $matches)) {
            $newContent = $matches[1] . $matches[2] . "\n" . $bindLine . $matches[3];
            $content = preg_replace($pattern, $newContent, $content);
        } else {
            return [
                'success' => false,
                'message' => "Método register() não encontrado em {$serviceProviderPath}"
            ];
        }

        // Adiciona imports se necessário
        $content = $this->addImportsIfNeeded($content, $interfaceClass, $implementationClass);

        if (!$dryRun) {
            // Backup do arquivo original
            File::copy($serviceProviderPath, $serviceProviderPath . '.backup.' . time());
            
            // Salva o novo conteúdo
            File::put($serviceProviderPath, $content);
        }

        return [
            'success' => true,
            'message' => "Registrada interface {$interface} no domínio {$domain}"
        ];
    }

    public function createMissingImplementations(array $missingInterfaces, bool $dryRun = false): array
    {
        $created = [];

        foreach ($missingInterfaces as $domain => $interfaces) {
            foreach ($interfaces as $interface) {
                $result = $this->createImplementation($domain, $interface, $dryRun);
                if ($result) {
                    $created[] = "Criada implementação {$interface} para {$domain}";
                }
            }
        }

        return $created;
    }

    private function createImplementation(string $domain, string $interface, bool $dryRun = false): bool
    {
        if (!isset($this->domainMappings[$domain]['implementations'][$interface])) {
            return false;
        }

        $implementationClass = $this->domainMappings[$domain]['implementations'][$interface];
        $implementationPath = $this->classToPath($implementationClass);

        if (File::exists($implementationPath)) {
            return true; // Já existe
        }

        $template = $this->generateRepositoryTemplate($implementationClass, $domain, $interface);

        if (!$dryRun) {
            // Cria diretório se não existir
            $directory = dirname($implementationPath);
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }

            File::put($implementationPath, $template);
        }

        return true;
    }

    private function classToPath(string $className): string
    {
        $relativePath = str_replace(['App\\', '\\'], ['app/', '/'], $className) . '.php';
        return base_path('Backend/' . $relativePath);
    }

    private function generateRepositoryTemplate(string $implementationClass, string $domain, string $interface): string
    {
        $namespace = dirname(str_replace('\\', '/', $implementationClass));
        $namespace = str_replace('/', '\\', $namespace);
        $className = basename(str_replace('\\', '/', $implementationClass));
        
        $interfaceClass = $this->domainMappings[$domain]['interfaces'][$interface];

        return "<?php

namespace {$namespace};

use {$interfaceClass};
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class {$className} implements " . class_basename($interfaceClass) . "
{
    // TODO: Implementar métodos da interface
    // Esta é uma implementação básica gerada automaticamente
    
    public function findAll(): Collection
    {
        // TODO: Implementar
        return new Collection();
    }
    
    public function findById(int \$id): ?object
    {
        // TODO: Implementar
        return null;
    }
    
    public function create(array \$data): object
    {
        // TODO: Implementar
        throw new \\Exception('Método create() não implementado');
    }
    
    public function update(int \$id, array \$data): bool
    {
        // TODO: Implementar
        return false;
    }
    
    public function delete(int \$id): bool
    {
        // TODO: Implementar
        return false;
    }
}";
    }

    private function addImportsIfNeeded(string $content, string $interfaceClass, string $implementationClass): string
    {
        $imports = [$interfaceClass, $implementationClass];
        
        foreach ($imports as $import) {
            if (strpos($content, "use {$import};") === false) {
                // Adiciona o import após os outros imports
                $pattern = '/(namespace .*?;\n)(.*?)(class )/s';
                if (preg_match($pattern, $content, $matches)) {
                    $newImport = "\nuse {$import};";
                    $content = $matches[1] . $matches[2] . $newImport . "\n\n" . $matches[3];
                }
            }
        }
        
        return $content;
    }
}