<?php

namespace App\Domains\AI\Providers\Integration;

use Illuminate\Support\ServiceProvider;

/**
 * 🔗 AI Integration Service Provider
 * 
 * Registra serviços de integração externa de IA
 */
class AIIntegrationServiceProvider extends ServiceProvider
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
            \App\Domains\AI\Infrastructure\Http\PyLabClient::class,
            \App\Domains\AI\Services\AIVideoGenerationService::class,
            \App\Domains\AI\Services\ChatService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Registrar cliente PyLab como singleton
        $this->app->singleton(\App\Domains\AI\Infrastructure\Http\PyLabClient::class);

        // Registrar serviços de IA como singletons
        $this->app->singleton(\App\Domains\AI\Services\AIVideoGenerationService::class, function ($app) {
            return new \App\Domains\AI\Services\AIVideoGenerationService(
                $app->make(\App\Domains\AI\Infrastructure\Http\PyLabClient::class)
            );
        });

        $this->app->singleton(\App\Domains\AI\Services\ChatService::class, function ($app) {
            return new \App\Domains\AI\Services\ChatService(
                $app->make(\App\Domains\AI\Infrastructure\Http\PyLabClient::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.ai.enabled', true) && config('modules.ai.integrations_enabled', true)) {
            // Registrar listeners de eventos de integração
            // Event::listen(AIIntegrationEvent::class, AIIntegrationListener::class);
        }
    }
}