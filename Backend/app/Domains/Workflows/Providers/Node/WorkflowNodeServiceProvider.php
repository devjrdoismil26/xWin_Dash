<?php

namespace App\Domains\Workflows\Providers\Node;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Executors\EmailNodeExecutor;
use Illuminate\Support\ServiceProvider;
use InvalidArgumentException;

/**
 * 🔗 Workflow Node Service Provider
 * 
 * Registra serviços de gerenciamento de nós de workflow
 */
class WorkflowNodeServiceProvider extends ServiceProvider
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
            WorkflowNodeExecutor::class,
            EmailNodeExecutor::class,
            \App\Domains\Workflows\Executors\HttpNodeExecutor::class,
            \App\Domains\Workflows\Executors\DatabaseNodeExecutor::class,
            \App\Domains\Workflows\Executors\NotificationNodeExecutor::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para WorkflowNodeExecutor com lazy loading e conditional loading
        $this->app->bind(WorkflowNodeExecutor::class, function ($app, $parameters) {
            $nodeType = $parameters['nodeType'] ?? null;

            // Carregar executor apenas quando necessário
            return match ($nodeType) {
                'email' => $app->make(EmailNodeExecutor::class),
                'http' => $app->make(\App\Domains\Workflows\Executors\HttpNodeExecutor::class),
                'database' => $app->make(\App\Domains\Workflows\Executors\DatabaseNodeExecutor::class),
                'notification' => $app->make(\App\Domains\Workflows\Executors\NotificationNodeExecutor::class),
                default => throw new InvalidArgumentException("Executor para tipo de nó inválido: {$nodeType}")
            };
        });

        // Binding para EmailNodeExecutor
        $this->app->bind(EmailNodeExecutor::class, function ($app) {
            return new EmailNodeExecutor();
        });

        // Binding para HttpNodeExecutor
        $this->app->bind(\App\Domains\Workflows\Executors\HttpNodeExecutor::class, function ($app) {
            return new \App\Domains\Workflows\Executors\HttpNodeExecutor();
        });

        // Binding para DatabaseNodeExecutor
        $this->app->bind(\App\Domains\Workflows\Executors\DatabaseNodeExecutor::class, function ($app) {
            return new \App\Domains\Workflows\Executors\DatabaseNodeExecutor();
        });

        // Binding para NotificationNodeExecutor
        $this->app->bind(\App\Domains\Workflows\Executors\NotificationNodeExecutor::class, function ($app) {
            return new \App\Domains\Workflows\Executors\NotificationNodeExecutor();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.workflows.enabled', true) && config('modules.workflows.nodes_enabled', true)) {
            // Registrar listeners de eventos de nós
            // Event::listen(WorkflowNodeEvent::class, WorkflowNodeListener::class);
        }
    }
}