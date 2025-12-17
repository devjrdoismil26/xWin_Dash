<?php

namespace App\Domains\Workflows\Providers\Core;

use Illuminate\Support\ServiceProvider;

/**
 * 🔄 Workflow Core Service Provider
 * 
 * Registra serviços core do domínio Workflows
 */
class WorkflowCoreServiceProvider extends ServiceProvider
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
            \App\Domains\Workflows\Services\WorkflowEngine::class,
            \App\Domains\Workflows\Services\WorkflowValidator::class,
            \App\Domains\Workflows\Services\WorkflowScheduler::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para engine principal com lazy loading
        $this->app->bind(
            \App\Domains\Workflows\Services\WorkflowEngine::class,
            function ($app) {
                return new \App\Domains\Workflows\Services\WorkflowEngine(
                    $app->make(\App\Domains\Workflows\Services\WorkflowValidator::class),
                    $app->make(\App\Domains\Workflows\Services\WorkflowScheduler::class)
                );
            }
        );

        // Binding para validator com lazy loading
        $this->app->bind(
            \App\Domains\Workflows\Services\WorkflowValidator::class,
            function ($app) {
                return new \App\Domains\Workflows\Services\WorkflowValidator();
            }
        );

        // Binding para scheduler com lazy loading
        $this->app->bind(
            \App\Domains\Workflows\Services\WorkflowScheduler::class,
            function ($app) {
                return new \App\Domains\Workflows\Services\WorkflowScheduler();
            }
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.workflows.enabled', true)) {
            // Carregar rotas apenas se necessário
            if (config('modules.workflows.load_routes', true)) {
                $this->loadRoutesFrom(__DIR__ . '/../../Http/routes.php');
            }
        }
    }
}