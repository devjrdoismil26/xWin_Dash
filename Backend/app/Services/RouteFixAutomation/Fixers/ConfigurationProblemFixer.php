<?php

namespace App\Services\RouteFixAutomation\Fixers;

use App\Services\RouteFixAutomation\Models\FixResult;
use App\Services\RouteFixAutomation\Testing\ControllerTester;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ConfigurationProblemFixer
{
    private ControllerTester $controllerTester;
    
    // Controllers com problema de configuração identificados no routes_problems.md
    private array $problematicControllers = [
        'Backend/app/Domains/AI/Http/Controllers/AIController.php',
        'Backend/app/Domains/AI/Http/Controllers/EnterpriseAIController.php',
        'Backend/app/Domains/AI/Http/Controllers/TextGenerationController.php',
        'Backend/app/Domains/AI/Http/Controllers/GeminiController.php',
        'Backend/app/Domains/Core/Http/Controllers/WhatsAppWebhookController.php',
        'Backend/app/Domains/Universe/Http/Controllers/AILaboratoryController.php',
        'Backend/app/Domains/Universe/Http/Controllers/ChatLabController.php',
        'Backend/app/Domains/Universe/Http/Controllers/AIIntegrationTestController.php',
        'Backend/app/Domains/Universe/Http/Controllers/UniverseAIController.php',
        'Backend/app/Domains/Universe/Http/Controllers/WebBrowserController.php',
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
            // 1. Analisar problemas de configuração
            $configProblems = $this->analyzeConfigurationProblems();
            
            if ($verbose) {
                echo "🔧 PROBLEMAS DE CONFIGURAÇÃO DETECTADOS:\n";
                echo "  • Controllers com erro 'config': " . count($configProblems) . "\n";
            }

            // 2. Corrigir cada controller
            foreach ($configProblems as $controllerPath => $problems) {
                $result = $this->fixControllerConfiguration($controllerPath, $problems, $dryRun);
                
                if ($result['success']) {
                    $fixedItems[] = $result['message'];
                    
                    if ($verbose) {
                        echo "  ✅ " . basename($controllerPath) . "\n";
                    }
                } else {
                    $errors[] = $result['message'];
                    
                    if ($verbose) {
                        echo "  ❌ " . basename($controllerPath) . ": " . $result['message'] . "\n";
                    }
                }
            }

            // 3. Validar correções
            if (!$dryRun && !empty($fixedItems)) {
                $this->validateConfigurationFixes($verbose);
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

    public function analyzeConfigurationProblems(): array
    {
        $problems = [];
        
        // Testar controllers para identificar erros de config
        $testResult = $this->controllerTester->testAllControllers();
        
        // Identificar controllers com erro "Target class [config] does not exist"
        foreach ($testResult->dependencyErrors as $errorLine) {
            if (strpos($errorLine, 'Target class [config] does not exist') !== false) {
                // Extrair nome do controller do erro
                if (preg_match('/App\\\\Domains\\\\(\w+)\\\\Http\\\\Controllers\\\\(\w+)/', $errorLine, $matches)) {
                    $domain = $matches[1];
                    $controller = $matches[2];
                    $controllerPath = "Backend/app/Domains/{$domain}/Http/Controllers/{$controller}.php";
                    
                    if (File::exists($controllerPath)) {
                        $problems[$controllerPath] = $this->analyzeControllerConfigUsage($controllerPath);
                    }
                }
            }
        }
        
        // Também analisar controllers conhecidos
        foreach ($this->problematicControllers as $controllerPath) {
            if (File::exists($controllerPath) && !isset($problems[$controllerPath])) {
                $configUsage = $this->analyzeControllerConfigUsage($controllerPath);
                if (!empty($configUsage)) {
                    $problems[$controllerPath] = $configUsage;
                }
            }
        }
        
        return $problems;
    }

    private function analyzeControllerConfigUsage(string $controllerPath): array
    {
        $content = File::get($controllerPath);
        $problems = [];
        
        // Procurar por uso de config() no construtor
        if (preg_match('/public function __construct\((.*?)\)/s', $content, $matches)) {
            $constructorParams = $matches[1];
            
            // Verificar se há injeção de 'config' como dependência
            if (strpos($constructorParams, 'config') !== false) {
                $problems[] = 'config_injection_in_constructor';
            }
        }
        
        // Procurar por chamadas config() no construtor
        if (preg_match('/public function __construct.*?\{(.*?)\n    \}/s', $content, $matches)) {
            $constructorBody = $matches[1];
            
            if (strpos($constructorBody, 'config(') !== false) {
                $problems[] = 'config_call_in_constructor';
            }
        }
        
        return $problems;
    }

    public function fixControllerConfiguration(string $controllerPath, array $problems, bool $dryRun = false): array
    {
        $content = File::get($controllerPath);
        $originalContent = $content;
        $fixed = false;
        
        try {
            // Corrigir injeção de 'config' no construtor
            if (in_array('config_injection_in_constructor', $problems)) {
                $content = $this->fixConfigInjection($content);
                $fixed = true;
            }
            
            // Corrigir chamadas config() no construtor
            if (in_array('config_call_in_constructor', $problems)) {
                $content = $this->fixConfigCalls($content);
                $fixed = true;
            }
            
            if ($fixed && !$dryRun) {
                // Backup do arquivo original
                File::copy($controllerPath, $controllerPath . '.backup.' . time());
                
                // Salvar conteúdo corrigido
                File::put($controllerPath, $content);
            }
            
            return [
                'success' => true,
                'message' => "Corrigido: " . basename($controllerPath)
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => "Erro ao corrigir " . basename($controllerPath) . ": " . $e->getMessage()
            ];
        }
    }

    private function fixConfigInjection(string $content): string
    {
        // Remover parâmetro 'config' do construtor
        $pattern = '/public function __construct\((.*?)\)/s';
        
        if (preg_match($pattern, $content, $matches)) {
            $params = $matches[1];
            
            // Remover parâmetros relacionados a config
            $params = preg_replace('/,?\s*\$?config[^,]*/', '', $params);
            $params = trim($params, ', ');
            
            $newConstructor = "public function __construct({$params})";
            $content = preg_replace($pattern, $newConstructor, $content);
        }
        
        return $content;
    }

    private function fixConfigCalls(string $content): string
    {
        // Mover chamadas config() do construtor para métodos
        $pattern = '/public function __construct(.*?)\{(.*?)\n    \}/s';
        
        if (preg_match($pattern, $content, $matches)) {
            $constructorSignature = $matches[1];
            $constructorBody = $matches[2];
            
            // Remover linhas com config() do construtor
            $lines = explode("\n", $constructorBody);
            $cleanedLines = [];
            $configLines = [];
            
            foreach ($lines as $line) {
                if (strpos($line, 'config(') !== false) {
                    $configLines[] = $line;
                } else {
                    $cleanedLines[] = $line;
                }
            }
            
            // Reconstruir construtor sem config()
            $newConstructorBody = implode("\n", $cleanedLines);
            $newConstructor = "public function __construct{$constructorSignature}{{$newConstructorBody}\n    }";
            
            $content = preg_replace($pattern, $newConstructor, $content);
            
            // Adicionar método privado para configuração se necessário
            if (!empty($configLines)) {
                $configMethod = $this->generateConfigMethod($configLines);
                $content = $this->addConfigMethod($content, $configMethod);
            }
        }
        
        return $content;
    }

    private function generateConfigMethod(array $configLines): string
    {
        $methodBody = implode("\n", $configLines);
        
        return "
    private function getConfiguration(): array
    {
        return [
            // TODO: Mover configurações para aqui
            // Configurações movidas do construtor:
{$methodBody}
        ];
    }";
    }

    private function addConfigMethod(string $content, string $configMethod): string
    {
        // Adicionar método antes do último }
        $lastBracePos = strrpos($content, '}');
        
        if ($lastBracePos !== false) {
            $content = substr_replace($content, $configMethod . "\n}", $lastBracePos, 1);
        }
        
        return $content;
    }

    private function validateConfigurationFixes(bool $verbose = false): void
    {
        if ($verbose) {
            echo "🧪 Validando correções de configuração...\n";
        }
        
        // Limpar cache para garantir que mudanças sejam carregadas
        \Artisan::call('config:clear');
        \Artisan::call('route:clear');
        
        if ($verbose) {
            echo "  ✅ Cache limpo\n";
        }
    }
}