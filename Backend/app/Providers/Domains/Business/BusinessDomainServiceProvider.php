<?php

namespace App\Providers\Domains\Business;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;

/**
 * 💼 Business Domain Service Provider
 * 
 * Registra serviços dos domínios de negócio da aplicação
 */
class BusinessDomainServiceProvider extends ServiceProvider
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
            'business.domains',
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Registrar domínios de negócio
        $this->registerBusinessDomains();
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('domains.business.enabled', true)) {
            // Boot dos domínios de negócio
            $this->bootBusinessDomains();
        }
    }

    /**
     * Registrar domínios de negócio.
     */
    protected function registerBusinessDomains(): void
    {
        $businessDomains = config('domains.business.domains', [
            'Projects',
            'Products',
            'Leads',
            'Categorization',
        ]);

        foreach ($businessDomains as $domainName) {
            $this->registerDomainProvider($domainName);
        }
    }

    /**
     * Boot dos domínios de negócio.
     */
    protected function bootBusinessDomains(): void
    {
        // Boot específico para domínios de negócio
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