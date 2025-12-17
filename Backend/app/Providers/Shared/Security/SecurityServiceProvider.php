<?php

namespace App\Providers\Shared\Security;

use Illuminate\Support\ServiceProvider;
use App\Shared\Transactions\TransactionManager;

/**
 * 🔒 Security Service Provider
 * 
 * Registra serviços de segurança e transações
 */
class SecurityServiceProvider extends ServiceProvider
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
            TransactionManager::class,
            'transaction.manager',
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Register transaction manager
        $this->app->singleton(TransactionManager::class, function ($app) {
            return new TransactionManager();
        });

        // Register alias for easier access
        $this->app->alias(TransactionManager::class, 'transaction.manager');
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('shared.security.enabled', true)) {
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