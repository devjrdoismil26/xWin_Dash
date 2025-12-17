<?php

namespace App\Domains\Workflows\Providers\Integration;

use Illuminate\Support\ServiceProvider;

/**
 * 🔗 Workflow Integration Service Provider
 * 
 * Registra serviços de integração externa do domínio Workflows
 */
class WorkflowIntegrationServiceProvider extends ServiceProvider
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
            \App\Domains\Workflows\Services\WorkflowApiService::class,
            \App\Domains\Workflows\Services\WorkflowWebhookService::class,
            \App\Domains\Workflows\Services\WorkflowNotificationService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para API service com lazy loading
        $this->app->bind(
            \App\Domains\Workflows\Services\WorkflowApiService::class,
            function ($app) {
                return new \App\Domains\Workflows\Services\WorkflowApiService(
                    $app->make(\App\Domains\Workflows\Services\WorkflowEngine::class)
                );
            }
        );

        // Binding para webhook service com lazy loading
        $this->app->bind(
            \App\Domains\Workflows\Services\WorkflowWebhookService::class,
            function ($app) {
                return new \App\Domains\Workflows\Services\WorkflowWebhookService(
                    $app->make(\App\Domains\Workflows\Services\WorkflowEngine::class)
                );
            }
        );

        // Binding para notification service com lazy loading
        $this->app->bind(
            \App\Domains\Workflows\Services\WorkflowNotificationService::class,
            function ($app) {
                return new \App\Domains\Workflows\Services\WorkflowNotificationService(
                    $app->make(\App\Domains\Workflows\Services\WorkflowEngine::class)
                );
            }
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.workflows.enabled', true) && config('modules.workflows.integrations_enabled', true)) {
            // Registrar listeners de eventos de integração
            // Event::listen(WorkflowIntegrationEvent::class, WorkflowIntegrationListener::class);
        }
    }
}