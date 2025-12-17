<?php

namespace App\Providers\Domains\Utility;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;

/**
 * 🛠️ Utility Domain Service Provider
 * 
 * Registra serviços dos domínios utilitários da aplicação
 */
class UtilityDomainServiceProvider extends ServiceProvider
{
    /**
     * Indica se o provider deve ser carregado apenas quando necessário
     */
    protected $defer = true;

    /**
     * Lista de serviços fornecidos por este provider
     */
    public function provides(): array
    {
        return [
            'utility.domains',
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Registrar domínios utilitários
        $this->registerUtilityDomains();
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('domains.utility.enabled', true)) {
            // Boot dos domínios utilitários
            $this->bootUtilityDomains();
        }
    }

    /**
     * Registrar domínios utilitários.
     */
    protected function registerUtilityDomains(): void
    {
        $utilityDomains = config('domains.utility.domains', [
            'Analytics',
            'EmailMarketing',
            'Activity',
            'Media',
        ]);

        foreach ($utilityDomains as $domainName) {
            $this->registerDomainProvider($domainName);
        }
    }

    /**
     * Boot dos domínios utilitários.
     */
    protected function bootUtilityDomains(): void
    {
        // Boot específico para domínios utilitários
    }

    /**
     * Registrar provider de domínio.
     */
    protected function registerDomainProvider(string $domainName): void
    {
        $domainPath = app_path("Domains/{$domainName}");
        
        if (!File::isDirectory($domainPath)) {
            return;
        }

        $providerPath = $domainPath . "/Providers/{$domainName}ServiceProvider.php";

        if (File::exists($providerPath)) {
            $providerClass = "App\\Domains\\{$domainName}\\Providers\\{$domainName}ServiceProvider";
            
            if (class_exists($providerClass)) {
                $this->app->register($providerClass);
            }
        }
    }
}