<?php

namespace App\Providers\Security\Authorization;

use Illuminate\Support\ServiceProvider;

/**
 * 🛡️ Authorization Service Provider
 * 
 * Registra serviços de autorização
 */
class AuthorizationServiceProvider extends ServiceProvider
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
            \App\Services\Security\AuthorizationService::class,
            \App\Services\Security\PermissionService::class,
            \App\Services\Security\RoleService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para authorization service
        $this->app->bind(\App\Services\Security\AuthorizationService::class, function ($app) {
            return new \App\Services\Security\AuthorizationService();
        });

        // Binding para permission service
        $this->app->bind(\App\Services\Security\PermissionService::class, function ($app) {
            return new \App\Services\Security\PermissionService();
        });

        // Binding para role service
        $this->app->bind(\App\Services\Security\RoleService::class, function ($app) {
            return new \App\Services\Security\RoleService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('security.authorization.enabled', true)) {
            // Registrar listeners de eventos de autorização
            // Event::listen(AuthorizationEvent::class, AuthorizationListener::class);
        }
    }
}