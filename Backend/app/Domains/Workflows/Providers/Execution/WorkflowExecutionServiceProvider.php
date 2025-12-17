<?php

namespace App\Domains\Workflows\Providers\Execution;

use Illuminate\Support\ServiceProvider;

/**
 * ⚡ Workflow Execution Service Provider
 * 
 * Registra serviços de execução e monitoramento de workflows
 */
class WorkflowExecutionServiceProvider extends ServiceProvider
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
            \App\Domains\Workflows\Services\CircuitBreakerService::class,
            \App\Domains\Workflows\Services\WorkflowExecutor::class,
            \App\Domains\Workflows\Services\WorkflowMonitor::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para CircuitBreakerService com lazy loading
        $this->app->bind(
            \App\Domains\Workflows\Services\CircuitBreakerService::class,
            function ($app) {
                return new \App\Domains\Workflows\Services\CircuitBreakerService(
                    'workflow_service',
                    config('workflows.circuit_breaker.failure_threshold', 5),
                    config('workflows.circuit_breaker.retry_timeout', 60),
                    config('workflows.circuit_breaker.timeout', 30),
                );
            }
        );

        // Binding para executor com lazy loading
        $this->app->bind(
            \App\Domains\Workflows\Services\WorkflowExecutor::class,
            function ($app) {
                return new \App\Domains\Workflows\Services\WorkflowExecutor(
                    $app->make(\App\Domains\Workflows\Services\CircuitBreakerService::class)
                );
            }
        );

        // Binding para monitor com lazy loading
        $this->app->bind(
            \App\Domains\Workflows\Services\WorkflowMonitor::class,
            function ($app) {
                return new \App\Domains\Workflows\Services\WorkflowMonitor(
                    $app->make(\App\Domains\Workflows\Services\WorkflowExecutor::class)
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
        if (config('modules.workflows.enabled', true) && config('modules.workflows.execution_enabled', true)) {
            // Registrar listeners de eventos de execução
            // Event::listen(WorkflowExecutionEvent::class, WorkflowExecutionListener::class);
        }
    }
}