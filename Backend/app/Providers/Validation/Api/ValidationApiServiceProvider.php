<?php

namespace App\Providers\Validation\Api;

use Illuminate\Support\ServiceProvider;

/**
 * 🔌 Validation API Service Provider
 * 
 * Registra serviços de validação de API
 */
class ValidationApiServiceProvider extends ServiceProvider
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
            \App\Services\Validation\Api\ApiValidationService::class,
            \App\Services\Validation\Api\RequestValidator::class,
            \App\Services\Validation\Api\ResponseValidator::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para API validation service
        $this->app->bind(\App\Services\Validation\Api\ApiValidationService::class, function ($app) {
            return new \App\Services\Validation\Api\ApiValidationService();
        });

        // Binding para request validator
        $this->app->bind(\App\Services\Validation\Api\RequestValidator::class, function ($app) {
            return new \App\Services\Validation\Api\RequestValidator();
        });

        // Binding para response validator
        $this->app->bind(\App\Services\Validation\Api\ResponseValidator::class, function ($app) {
            return new \App\Services\Validation\Api\ResponseValidator();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('validation.api.enabled', true)) {
            // Registrar listeners de eventos de API
            // Event::listen(ApiValidationEvent::class, ApiValidationListener::class);
        }
    }
}