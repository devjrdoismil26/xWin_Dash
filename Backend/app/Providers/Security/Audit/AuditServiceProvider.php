<?php

namespace App\Providers\Security\Audit;

use Illuminate\Support\ServiceProvider;

/**
 * 📋 Audit Service Provider
 * 
 * Registra serviços de auditoria e logging de segurança
 */
class AuditServiceProvider extends ServiceProvider
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
            \App\Services\Security\AuditService::class,
            \App\Services\Security\SecurityLogService::class,
            \App\Shared\Transactions\TransactionManager::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para audit service
        $this->app->bind(\App\Services\Security\AuditService::class, function ($app) {
            return new \App\Services\Security\AuditService();
        });

        // Binding para security log service
        $this->app->bind(\App\Services\Security\SecurityLogService::class, function ($app) {
            return new \App\Services\Security\SecurityLogService();
        });

        // Register transaction manager (moved from Shared/Security)
        $this->app->singleton(\App\Shared\Transactions\TransactionManager::class, function ($app) {
            return new \App\Shared\Transactions\TransactionManager();
        });

        // Register alias for easier access
        $this->app->alias(\App\Shared\Transactions\TransactionManager::class, 'transaction.manager');
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('security.audit.enabled', true)) {
            // Setup security system
            $this->setupSecuritySystem();
        }
    }

    /**
     * Setup security system.
     */
    protected function setupSecuritySystem(): void
    {
        // Setup transaction management
        $this->app->booted(function () {
            // Register transaction event listeners
            // Event::listen(TransactionEvent::class, TransactionListener::class);
        });
    }
}