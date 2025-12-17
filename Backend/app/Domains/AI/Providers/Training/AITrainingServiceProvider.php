<?php

namespace App\Domains\AI\Providers\Training;

use Illuminate\Support\ServiceProvider;

/**
 * 🎓 AI Training Service Provider
 * 
 * Registra serviços de treinamento e otimização de IA
 */
class AITrainingServiceProvider extends ServiceProvider
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
            \App\Domains\AI\Services\AITrainingService::class,
            \App\Domains\AI\Services\ModelOptimizationService::class,
            \App\Domains\AI\Services\TrainingDataService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para AI training service
        $this->app->bind(\App\Domains\AI\Services\AITrainingService::class, function ($app) {
            return new \App\Domains\AI\Services\AITrainingService();
        });

        // Binding para model optimization service
        $this->app->bind(\App\Domains\AI\Services\ModelOptimizationService::class, function ($app) {
            return new \App\Domains\AI\Services\ModelOptimizationService(
                $app->make(\App\Domains\AI\Services\AITrainingService::class)
            );
        });

        // Binding para training data service
        $this->app->bind(\App\Domains\AI\Services\TrainingDataService::class, function ($app) {
            return new \App\Domains\AI\Services\TrainingDataService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.ai.enabled', true) && config('modules.ai.training_enabled', true)) {
            // Registrar listeners de eventos de treinamento
            // Event::listen(AITrainingEvent::class, AITrainingListener::class);
        }
    }
}