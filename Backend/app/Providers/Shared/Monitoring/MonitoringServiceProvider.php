<?php

namespace App\Providers\Shared\Monitoring;

use Illuminate\Support\ServiceProvider;
use App\Infrastructure\Monitoring\APMMonitoringService;
use App\Infrastructure\Monitoring\QueueHealthMonitoringService;

/**
 * 📊 Monitoring Service Provider
 * 
 * Registra serviços de monitoramento do sistema
 */
class MonitoringServiceProvider extends ServiceProvider
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
            APMMonitoringService::class,
            QueueHealthMonitoringService::class,
            'apm.monitor',
            'queue.monitor',
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Register monitoring services as singletons
        $this->app->singleton(APMMonitoringService::class, function ($app) {
            return new APMMonitoringService();
        });

        $this->app->singleton(QueueHealthMonitoringService::class, function ($app) {
            return new QueueHealthMonitoringService($app->make('queue'));
        });

        // Register aliases for easier access
        $this->app->alias(APMMonitoringService::class, 'apm.monitor');
        $this->app->alias(QueueHealthMonitoringService::class, 'queue.monitor');
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('shared.monitoring.enabled', true)) {
            // Register console commands
            if ($this->app->runningInConsole()) {
                $this->commands([
                    \App\Shared\Console\Commands\MonitorSystemHealthCommand::class,
                ]);
            }

            // Setup monitoring
            $this->setupMonitoring();
        }
    }

    /**
     * Setup monitoring and alerting.
     */
    protected function setupMonitoring(): void
    {
        // Schedule monitoring tasks if running via scheduler
        $this->app->booted(function () {
            if ($this->app->runningInConsole()) {
                return;
            }

            // Register APM middleware for web requests
            $this->registerAPMMiddleware();
        });
    }

    /**
     * Register APM middleware for performance monitoring.
     */
    protected function registerAPMMiddleware(): void
    {
        // Carregamento condicional do middleware APM
        if (config('shared.monitoring.apm_middleware_enabled', true)) {
            try {
                $kernel = $this->app->make(\Illuminate\Contracts\Http\Kernel::class);
                $kernel->pushMiddleware(\App\Shared\Http\Middleware\APMMiddleware::class);
            } catch (\Exception $e) {
                // Log error but don't break the application
                \Illuminate\Support\Facades\Log::warning('Failed to register APM middleware: ' . $e->getMessage());
            }
        }
    }
}