<?php

namespace App\Services\RouteFixAutomation\Fixers;

use App\Services\RouteFixAutomation\Models\FixResult;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ServiceProviderFixer
{
    private string $configPath;
    private array $knownProviders;

    public function __construct()
    {
        $this->configPath = config_path('app.php');
        $this->knownProviders = [
            'App\Domains\AI\Providers\AIDomainServiceProvider::class',
            'App\Domains\EmailMarketing\Providers\EmailMarketingDomainServiceProvider::class',
            'App\Domains\Analytics\Providers\AnalyticsDomainServiceProvider::class',
            'App\Domains\ADStool\Providers\ADStoolDomainServiceProvider::class',
            'App\Domains\Media\Providers\MediaDomainServiceProvider::class',
            'App\Domains\NodeRed\Providers\NodeRedDomainServiceProvider::class',
            'App\Domains\Products\Providers\ProductsDomainServiceProvider::class',
            'App\Domains\Users\Providers\UsersDomainServiceProvider::class',
        ];
    }

    public function executeAll(bool $verbose = false, bool $dryRun = false): FixResult
    {
        $startTime = microtime(true);
        $fixedItems = [];
        $errors = [];

        try {
            // 1. Analisar providers registrados
            $analysis = $this->analyzeRegisteredProviders();
            
            if ($verbose) {
                echo "📊 ANÁLISE DE SERVICE PROVIDERS:\n";
                echo "  • Providers ativos: " . count($analysis['active']) . "\n";
                echo "  • Providers comentados: " . count($analysis['commented']) . "\n";
                echo "  • Providers faltantes: " . count($analysis['missing']) . "\n";
            }

            // 2. Reativar providers comentados
            if (!empty($analysis['commented'])) {
                $reactivated = $this->enableDisabledProviders($analysis['commented'], $dryRun);
                $fixedItems = array_merge($fixedItems, $reactivated);
                
                if ($verbose) {
                    echo "✅ Providers reativados: " . count($reactivated) . "\n";
                }
            }

            // 3. Validar carregamento
            if (!$dryRun) {
                $validation = $this->validateProviderLoading();
                if (!$validation['success']) {
                    $errors = array_merge($errors, $validation['errors']);
                }
            }

            // 4. Testar config cache
            if (!$dryRun) {
                $cacheTest = $this->testConfigCache();
                if (!$cacheTest) {
                    $errors[] = "Falha no teste de config:cache";
                }
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

    public function analyzeRegisteredProviders(): array
    {
        $configContent = File::get($this->configPath);
        
        $active = [];
        $commented = [];
        $missing = [];

        foreach ($this->knownProviders as $provider) {
            $providerClass = str_replace('::class', '', $provider);
            
            // Escapa caracteres especiais para regex
            $escapedProvider = preg_quote($provider, '/');
            
            // Verifica se está ativo
            if (preg_match("/^\s*{$escapedProvider}/m", $configContent)) {
                $active[] = $provider;
            }
            // Verifica se está comentado
            elseif (preg_match("/^\s*\/\/\s*{$escapedProvider}/m", $configContent)) {
                $commented[] = $provider;
            }
            // Se não encontrou, está faltante
            else {
                $missing[] = $provider;
            }
        }

        return [
            'active' => $active,
            'commented' => $commented,
            'missing' => $missing
        ];
    }

    public function enableDisabledProviders(array $commentedProviders, bool $dryRun = false): array
    {
        if (empty($commentedProviders)) {
            return [];
        }

        $configContent = File::get($this->configPath);
        $originalContent = $configContent;
        $reactivated = [];

        foreach ($commentedProviders as $provider) {
            // Escapa caracteres especiais para regex
            $escapedProvider = preg_quote($provider, '/');
            
            // Procura por linhas comentadas com este provider
            $pattern = "/^(\s*)\/\/\s*({$escapedProvider}.*)/m";
            
            if (preg_match($pattern, $configContent, $matches)) {
                $indent = $matches[1];
                $providerLine = $matches[2];
                
                // Remove o comentário
                $newLine = $indent . $providerLine . " // REATIVADO - Correção automática";
                $configContent = preg_replace($pattern, $newLine, $configContent);
                
                $reactivated[] = "Reativado: {$provider}";
            }
        }

        if (!$dryRun && !empty($reactivated)) {
            // Backup do arquivo original
            File::copy($this->configPath, $this->configPath . '.backup.' . time());
            
            // Salva o novo conteúdo
            File::put($this->configPath, $configContent);
        }

        return $reactivated;
    }

    public function validateProviderLoading(): array
    {
        $errors = [];
        
        try {
            // Tenta recarregar a configuração
            \Artisan::call('config:clear');
            
            // Verifica se os providers podem ser carregados
            $providers = config('app.providers', []);
            
            foreach ($this->knownProviders as $provider) {
                $providerClass = str_replace('::class', '', $provider);
                
                if (in_array($provider, $providers)) {
                    // Tenta verificar se a classe existe
                    if (!class_exists($providerClass)) {
                        $errors[] = "Provider class não existe: {$providerClass}";
                    }
                }
            }
            
        } catch (\Exception $e) {
            $errors[] = "Erro ao validar providers: " . $e->getMessage();
        }

        return [
            'success' => empty($errors),
            'errors' => $errors
        ];
    }

    public function testConfigCache(): bool
    {
        try {
            \Artisan::call('config:cache');
            return \Artisan::output() !== null;
        } catch (\Exception $e) {
            return false;
        }
    }
}