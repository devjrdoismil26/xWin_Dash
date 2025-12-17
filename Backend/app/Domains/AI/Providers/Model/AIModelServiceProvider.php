<?php

namespace App\Domains\AI\Providers\Model;

use Illuminate\Support\ServiceProvider;

/**
 * 🧠 AI Model Service Provider
 * 
 * Registra serviços de gerenciamento de modelos de IA
 */
class AIModelServiceProvider extends ServiceProvider
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
            \App\Domains\AI\Domain\AIGenerationRepositoryInterface::class,
            \App\Domains\AI\Domain\ChatbotRepositoryInterface::class,
            \App\Domains\AI\Services\ModelManagementService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para AI generation repository
        $this->app->bind(
            \App\Domains\AI\Domain\AIGenerationRepositoryInterface::class,
            \App\Domains\AI\Infrastructure\Persistence\Eloquent\AIGenerationRepository::class
        );

        // Binding para chatbot repository
        $this->app->bind(
            \App\Domains\AI\Domain\ChatbotRepositoryInterface::class,
            \App\Domains\AI\Infrastructure\Persistence\Eloquent\ChatbotRepository::class
        );

        // Binding para model management service
        $this->app->bind(\App\Domains\AI\Services\ModelManagementService::class, function ($app) {
            return new \App\Domains\AI\Services\ModelManagementService(
                $app->make(\App\Domains\AI\Domain\AIGenerationRepositoryInterface::class),
                $app->make(\App\Domains\AI\Domain\ChatbotRepositoryInterface::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.ai.enabled', true) && config('modules.ai.models_enabled', true)) {
            // Registrar listeners de eventos de modelos
            // Event::listen(AIModelEvent::class, AIModelListener::class);
        }
    }
}