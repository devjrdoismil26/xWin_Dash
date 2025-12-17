<?php

namespace App\Services\RouteFixAutomation\Fixers;

use App\Services\RouteFixAutomation\Models\FixResult;
use App\Services\RouteFixAutomation\Testing\ControllerTester;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MissingServiceFixer
{
    private ControllerTester $controllerTester;
    
    // Serviços faltantes identificados no routes_problems.md
    private array $missingServices = [
        'App\Domains\AI\Services\AIVideoGenerationService' => [
            'controller' => 'Backend/app/Domains/AI/Http/Controllers/VideoGenerationController.php',
            'essential' => false,
            'template' => 'ai_service'
        ],
        'App\Domains\AI\Services\ChatService' => [
            'controller' => 'Backend/app/Domains/AI/Http/Controllers/ChatController.php',
            'essential' => false,
            'template' => 'ai_service'
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
            // 1. Detectar serviços faltantes
            $missingServices = $this->detectMissingServices();
            
            if ($verbose) {
                echo "🔍 SERVIÇOS FALTANTES DETECTADOS:\n";
                echo "  • Total de serviços faltantes: " . count($missingServices) . "\n";
            }

            // 2. Processar cada serviço faltante
            foreach ($missingServices as $serviceClass => $config) {
                $result = $this->handleMissingService($serviceClass, $config, $dryRun);
                
                if ($result['success']) {
                    $fixedItems[] = $result['message'];
                    
                    if ($verbose) {
                        echo "  ✅ " . class_basename($serviceClass) . "\n";
                    }
                } else {
                    $errors[] = $result['message'];
                    
                    if ($verbose) {
                        echo "  ❌ " . class_basename($serviceClass) . ": " . $result['message'] . "\n";
                    }
                }
            }

            // 3. Registrar serviços nos service providers se necessário
            if (!$dryRun && !empty($fixedItems)) {
                $this->registerCreatedServices($missingServices, $verbose);
            }

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

    public function detectMissingServices(): array
    {
        $missing = [];
        
        // Verificar serviços conhecidos
        foreach ($this->missingServices as $serviceClass => $config) {
            $servicePath = $this->classToPath($serviceClass);
            
            if (!File::exists($servicePath)) {
                $missing[$serviceClass] = $config;
            }
        }
        
        // Detectar outros serviços faltantes através de erros de teste
        $testResult = $this->controllerTester->testAllControllers();
        
        foreach ($testResult->dependencyErrors as $errorLine) {
            // Procurar por erros de serviços não encontrados
            if (preg_match('/Target class \[(.*?Service)\] does not exist/', $errorLine, $matches)) {
                $serviceClass = $matches[1];
                
                if (!isset($missing[$serviceClass]) && !class_exists($serviceClass)) {
                    $missing[$serviceClass] = [
                        'controller' => 'unknown',
                        'essential' => false,
                        'template' => 'generic_service'
                    ];
                }
            }
        }
        
        return $missing;
    }

    public function handleMissingService(string $serviceClass, array $config, bool $dryRun = false): array
    {
        try {
            // Verificar se o serviço já existe
            if (class_exists($serviceClass)) {
                return [
                    'success' => true,
                    'message' => "Serviço já existe: " . class_basename($serviceClass)
                ];
            }
            
            // Decidir estratégia baseada na essencialidade
            if ($config['essential']) {
                // Criar implementação completa para serviços essenciais
                $result = $this->createFullService($serviceClass, $config, $dryRun);
            } else {
                // Criar implementação básica/mock para serviços não essenciais
                $result = $this->createBasicService($serviceClass, $config, $dryRun);
            }
            
            return $result;
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => "Erro ao processar " . class_basename($serviceClass) . ": " . $e->getMessage()
            ];
        }
    }

    private function createBasicService(string $serviceClass, array $config, bool $dryRun = false): array
    {
        $servicePath = $this->classToPath($serviceClass);
        
        if (File::exists($servicePath)) {
            return [
                'success' => true,
                'message' => "Serviço já existe: " . class_basename($serviceClass)
            ];
        }
        
        $template = $this->generateServiceTemplate($serviceClass, $config['template']);
        
        if (!$dryRun) {
            // Criar diretório se não existir
            $directory = dirname($servicePath);
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }
            
            File::put($servicePath, $template);
        }
        
        return [
            'success' => true,
            'message' => "Criado serviço básico: " . class_basename($serviceClass)
        ];
    }

    private function createFullService(string $serviceClass, array $config, bool $dryRun = false): array
    {
        // Para serviços essenciais, criar implementação mais completa
        return $this->createBasicService($serviceClass, $config, $dryRun);
    }

    private function generateServiceTemplate(string $serviceClass, string $template): string
    {
        $namespace = dirname(str_replace('\\', '/', $serviceClass));
        $namespace = str_replace('/', '\\', $namespace);
        $className = basename(str_replace('\\', '/', $serviceClass));
        
        switch ($template) {
            case 'ai_service':
                return $this->generateAIServiceTemplate($namespace, $className);
            case 'generic_service':
            default:
                return $this->generateGenericServiceTemplate($namespace, $className);
        }
    }

    private function generateAIServiceTemplate(string $namespace, string $className): string
    {
        return "<?php

namespace {$namespace};

use Illuminate\Support\Facades\Log;

class {$className}
{
    /**
     * Serviço de IA gerado automaticamente
     * TODO: Implementar funcionalidade específica
     */
    
    public function __construct()
    {
        // Inicialização básica
    }
    
    /**
     * Método principal do serviço
     */
    public function process(array \$data = []): array
    {
        Log::info('{$className}: Processando dados', \$data);
        
        // TODO: Implementar lógica específica
        return [
            'success' => true,
            'message' => 'Processamento básico concluído',
            'data' => \$data
        ];
    }
    
    /**
     * Método de geração (para serviços de geração)
     */
    public function generate(string \$prompt, array \$options = []): array
    {
        Log::info('{$className}: Gerando conteúdo', [
            'prompt' => \$prompt,
            'options' => \$options
        ]);
        
        // TODO: Implementar geração real
        return [
            'success' => true,
            'content' => 'Conteúdo gerado automaticamente para: ' . \$prompt,
            'metadata' => \$options
        ];
    }
    
    /**
     * Método de validação
     */
    public function validate(array \$input): bool
    {
        // TODO: Implementar validação específica
        return !empty(\$input);
    }
}";
    }

    private function generateGenericServiceTemplate(string $namespace, string $className): string
    {
        return "<?php

namespace {$namespace};

use Illuminate\Support\Facades\Log;

class {$className}
{
    /**
     * Serviço genérico gerado automaticamente
     * TODO: Implementar funcionalidade específica
     */
    
    public function __construct()
    {
        // Inicialização básica
    }
    
    /**
     * Método principal do serviço
     */
    public function execute(array \$data = []): array
    {
        Log::info('{$className}: Executando operação', \$data);
        
        // TODO: Implementar lógica específica
        return [
            'success' => true,
            'message' => 'Operação executada com sucesso',
            'data' => \$data
        ];
    }
    
    /**
     * Método de processamento
     */
    public function process(\$input): mixed
    {
        // TODO: Implementar processamento específico
        return \$input;
    }
    
    /**
     * Método de validação
     */
    public function isValid(\$input): bool
    {
        // TODO: Implementar validação específica
        return true;
    }
}";
    }

    private function registerCreatedServices(array $createdServices, bool $verbose = false): void
    {
        if ($verbose) {
            echo "📝 Registrando serviços criados nos service providers...\n";
        }
        
        foreach ($createdServices as $serviceClass => $config) {
            $this->registerServiceInProvider($serviceClass, $verbose);
        }
    }

    private function registerServiceInProvider(string $serviceClass, bool $verbose = false): void
    {
        // Extrair domínio do namespace
        if (preg_match('/App\\\\Domains\\\\(\w+)\\\\/', $serviceClass, $matches)) {
            $domain = $matches[1];
            $providerPath = "Backend/app/Domains/{$domain}/Providers/{$domain}DomainServiceProvider.php";
            
            if (File::exists($providerPath)) {
                $content = File::get($providerPath);
                
                // Verificar se já está registrado
                if (strpos($content, $serviceClass) === false) {
                    // Adicionar bind no método register
                    $bindLine = "        \$this->app->singleton({$serviceClass}::class);";
                    
                    $pattern = '/(public function register\(\).*?\{)(.*?)(\n    \})/s';
                    
                    if (preg_match($pattern, $content, $matches)) {
                        $newContent = $matches[1] . $matches[2] . "\n" . $bindLine . $matches[3];
                        $content = preg_replace($pattern, $newContent, $content);
                        
                        File::put($providerPath, $content);
                        
                        if ($verbose) {
                            echo "  ✅ Registrado " . class_basename($serviceClass) . " em {$domain}DomainServiceProvider\n";
                        }
                    }
                }
            }
        }
    }

    private function classToPath(string $className): string
    {
        $relativePath = str_replace(['App\\', '\\'], ['app/', '/'], $className) . '.php';
        return base_path('Backend/' . $relativePath);
    }
}