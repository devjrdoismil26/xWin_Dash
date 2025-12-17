<?php

namespace App\Providers\Shared\QueryOptimization;

use Illuminate\Support\ServiceProvider;
use App\Infrastructure\Database\QueryOptimizationService;

/**
 * 🔍 Query Optimization Service Provider
 * 
 * Registra serviços de otimização de consultas do banco de dados
 */
class QueryOptimizationServiceProvider extends ServiceProvider
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
            QueryOptimizationService::class,
            'query.optimizer',
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Register query optimization service as singleton
        $this->app->singleton(QueryOptimizationService::class, function ($app) {
            return new QueryOptimizationService();
        });

        // Register alias for easier access
        $this->app->alias(QueryOptimizationService::class, 'query.optimizer');
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('shared.query_optimization.enabled', true)) {
            // Setup query optimization
            $this->setupQueryOptimization();
        }
    }

    /**
     * Setup query optimization.
     */
    protected function setupQueryOptimization(): void
    {
        // Enable slow query logging if in debug mode
        if (config('app.debug', false) && config('shared.query_optimization.slow_query_logging_enabled', true)) {
            try {
                $queryOptimizer = $this->app->make(QueryOptimizationService::class);
                $threshold = config('shared.query_optimization.slow_query_threshold', 2.0);
                $queryOptimizer->enableSlowQueryLogging($threshold);
            } catch (\Exception $e) {
                // Log error but don't break the application
                \Illuminate\Support\Facades\Log::warning('Failed to enable slow query logging: ' . $e->getMessage());
            }
        }
    }
}