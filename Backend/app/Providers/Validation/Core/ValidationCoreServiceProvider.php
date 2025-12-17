<?php

namespace App\Providers\Validation\Core;

use Illuminate\Support\ServiceProvider;

/**
 * ✅ Validation Core Service Provider
 * 
 * Registra serviços core de validação
 */
class ValidationCoreServiceProvider extends ServiceProvider
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
            \App\Services\Validation\ValidationManager::class,
            \App\Services\Validation\RuleEngine::class,
            \App\Services\Validation\ValidationCache::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para validation manager
        $this->app->bind(\App\Services\Validation\ValidationManager::class, function ($app) {
            return new \App\Services\Validation\ValidationManager();
        });

        // Binding para rule engine
        $this->app->bind(\App\Services\Validation\RuleEngine::class, function ($app) {
            return new \App\Services\Validation\RuleEngine();
        });

        // Binding para validation cache
        $this->app->bind(\App\Services\Validation\ValidationCache::class, function ($app) {
            return new \App\Services\Validation\ValidationCache();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('validation.core.enabled', true)) {
            // Registrar listeners de eventos core
            // Event::listen(ValidationCoreEvent::class, ValidationCoreListener::class);
        }
    }
}