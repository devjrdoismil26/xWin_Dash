<?php

namespace App\Providers\Domains\Integration;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;

/**
 * 🔗 Integration Domain Service Provider
 * 
 * Registra serviços dos domínios de integração da aplicação
 */
class IntegrationDomainServiceProvider extends ServiceProvider
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
            'integration.domains',
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Registrar domínios de integração
        $this->registerIntegrationDomains();
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('domains.integration.enabled', true)) {
            // Boot dos domínios de integração
            $this->bootIntegrationDomains();
        }
    }

    /**
     * Registrar domínios de integração.
     */
    protected function registerIntegrationDomains(): void
    {
        $integrationDomains = config('domains.integration.domains', [
            'AI',
            'SocialBuffer',
            'Aura',
            'NodeRed',
            'ADStool',
        ]);

        foreach ($integrationDomains as $domainName) {
            $this->registerDomainProvider($domainName);
        }
    }

    /**
     * Boot dos domínios de integração.
     */
    protected function bootIntegrationDomains(): void
    {
        // Boot específico para domínios de integração
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