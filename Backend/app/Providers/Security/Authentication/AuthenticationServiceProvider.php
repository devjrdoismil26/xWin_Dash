<?php

namespace App\Providers\Security\Authentication;

use Illuminate\Support\ServiceProvider;

/**
 * 🔐 Authentication Service Provider
 * 
 * Registra serviços de autenticação
 */
class AuthenticationServiceProvider extends ServiceProvider
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
            \App\Services\Security\AuthenticationService::class,
            \App\Services\Security\TokenService::class,
            \App\Services\Security\SessionService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para authentication service
        $this->app->bind(\App\Services\Security\AuthenticationService::class, function ($app) {
            return new \App\Services\Security\AuthenticationService();
        });

        // Binding para token service
        $this->app->bind(\App\Services\Security\TokenService::class, function ($app) {
            return new \App\Services\Security\TokenService();
        });

        // Binding para session service
        $this->app->bind(\App\Services\Security\SessionService::class, function ($app) {
            return new \App\Services\Security\SessionService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('security.authentication.enabled', true)) {
            // Registrar listeners de eventos de autenticação
            // Event::listen(AuthenticationEvent::class, AuthenticationListener::class);
        }
    }
}