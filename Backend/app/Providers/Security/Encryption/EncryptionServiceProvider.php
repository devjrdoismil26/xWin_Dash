<?php

namespace App\Providers\Security\Encryption;

use Illuminate\Support\ServiceProvider;

/**
 * 🔐 Encryption Service Provider
 * 
 * Registra serviços de criptografia
 */
class EncryptionServiceProvider extends ServiceProvider
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
            \App\Services\Security\EncryptionService::class,
            \App\Services\Security\HashService::class,
            \App\Services\Security\KeyService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para encryption service
        $this->app->bind(\App\Services\Security\EncryptionService::class, function ($app) {
            return new \App\Services\Security\EncryptionService();
        });

        // Binding para hash service
        $this->app->bind(\App\Services\Security\HashService::class, function ($app) {
            return new \App\Services\Security\HashService();
        });

        // Binding para key service
        $this->app->bind(\App\Services\Security\KeyService::class, function ($app) {
            return new \App\Services\Security\KeyService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('security.encryption.enabled', true)) {
            // Registrar listeners de eventos de criptografia
            // Event::listen(EncryptionEvent::class, EncryptionListener::class);
        }
    }
}