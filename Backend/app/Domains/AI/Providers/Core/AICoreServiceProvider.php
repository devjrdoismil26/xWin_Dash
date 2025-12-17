<?php

namespace App\Domains\AI\Providers\Core;

use Illuminate\Support\ServiceProvider;

/**
 * 🤖 AI Core Service Provider
 * 
 * Registra serviços core de IA
 */
class AICoreServiceProvider extends ServiceProvider
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
            \App\Domains\AI\Services\AICoreService::class,
            \App\Domains\AI\Services\AIEngineService::class,
            \App\Domains\AI\Services\AIValidationService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para AI core service
        $this->app->bind(\App\Domains\AI\Services\AICoreService::class, function ($app) {
            return new \App\Domains\AI\Services\AICoreService();
        });

        // Binding para AI engine service
        $this->app->bind(\App\Domains\AI\Services\AIEngineService::class, function ($app) {
            return new \App\Domains\AI\Services\AIEngineService(
                $app->make(\App\Domains\AI\Services\AICoreService::class)
            );
        });

        // Binding para AI validation service
        $this->app->bind(\App\Domains\AI\Services\AIValidationService::class, function ($app) {
            return new \App\Domains\AI\Services\AIValidationService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.ai.enabled', true) && config('modules.ai.core_enabled', true)) {
            // Registrar listeners de eventos de AI core
            // Event::listen(AICoreEvent::class, AICoreListener::class);
        }
    }
}