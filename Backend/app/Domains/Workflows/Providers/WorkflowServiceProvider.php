<?php

namespace App\Domains\Workflows\Providers;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Executors\EmailNodeExecutor;
use Illuminate\Support\ServiceProvider;
use InvalidArgumentException;

class WorkflowServiceProvider extends ServiceProvider
{
    /**
     * Indicates if the provider is deferred.
     * 
     * @var bool
     */
    protected $defer = true;

    /**
     * The services that are provided by this provider.
     *
     * @var array
     */
    protected $provides = [
        // Service essencial
        \App\Domains\Workflows\Services\CircuitBreakerService::class,
        
        // Executor essencial
        WorkflowNodeExecutor::class,
    ];
    /**
     * Register any application services.
     */
    public function register()
    {
        // 🚀 OTIMIZADO: Registrar CircuitBreakerService com lazy loading
        $this->app->bind(\App\Domains\Workflows\Services\CircuitBreakerService::class, function ($app) {
            return new \App\Domains\Workflows\Services\CircuitBreakerService(
                'workflow_service',
                config('workflows.circuit_breaker.failure_threshold', 5),
                config('workflows.circuit_breaker.retry_timeout', 60),
                config('workflows.circuit_breaker.timeout', 30),
            );
        });

        // 🚀 OTIMIZADO: Registrar WorkflowNodeExecutor com lazy loading e conditional loading
        $this->app->bind(WorkflowNodeExecutor::class, function ($app, $parameters) {
            $nodeType = $parameters['nodeType'] ?? null;

            // Carregar executor apenas quando necessário
            return match ($nodeType) {
                'email' => $app->make(EmailNodeExecutor::class),
                // 🚀 OTIMIZADO: Outros executors carregados apenas quando necessário
                'http' => $app->make(\App\Domains\Workflows\Executors\HttpNodeExecutor::class),
                'database' => $app->make(\App\Domains\Workflows\Executors\DatabaseNodeExecutor::class),
                'notification' => $app->make(\App\Domains\Workflows\Executors\NotificationNodeExecutor::class),
                default => throw new InvalidArgumentException("Executor para tipo de nó inválido: {$nodeType}")
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 🚀 OTIMIZADO: Carregar rotas apenas se módulo Workflows estiver habilitado
        if (config('modules.workflows.enabled', true)) {
            $this->loadRoutesFrom(__DIR__ . '/../Http/routes.php');
        }
    }
}
