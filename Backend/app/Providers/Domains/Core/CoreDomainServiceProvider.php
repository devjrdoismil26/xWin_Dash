<?php

namespace App\Providers\Domains\Core;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;

/**
 * 🏗️ Core Domain Service Provider
 * 
 * Registra serviços dos domínios core da aplicação
 */
class CoreDomainServiceProvider extends ServiceProvider
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
            'core.domains',
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Registrar domínios core
        $this->registerCoreDomains();
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('domains.core.enabled', true)) {
            // Boot dos domínios core
            $this->bootCoreDomains();
        }
    }

    /**
     * Registrar domínios core.
     */
    protected function registerCoreDomains(): void
    {
        $coreDomains = config('domains.core.domains', [
            'Core',
            'Users',
            'Auth',
        ]);

        foreach ($coreDomains as $domainName) {
            $this->registerDomainProvider($domainName);
        }
    }

    /**
     * Boot dos domínios core.
     */
    protected function bootCoreDomains(): void
    {
        // Boot específico para domínios core
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