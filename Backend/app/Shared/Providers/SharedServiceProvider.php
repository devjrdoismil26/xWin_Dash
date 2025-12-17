<?php

namespace App\Shared\Providers;

use App\Infrastructure\Database\QueryOptimizationService;
use App\Infrastructure\Monitoring\AlertingService;
use App\Infrastructure\Monitoring\APMMonitoringService;
use App\Infrastructure\Monitoring\QueueHealthMonitoringService;
use App\Infrastructure\Testing\TestingStrategyService;
use App\Shared\Events\EventDispatcher;
use App\Shared\Events\EventStore;
use App\Shared\Services\CacheService;
use App\Shared\Transactions\TransactionManager;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;

class SharedServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register()
    {
        // Register monitoring services as singletons
        $this->app->singleton(APMMonitoringService::class, function ($app) {
            return new APMMonitoringService();
        });

        $this->app->singleton(AlertingService::class, function ($app) {
            return new AlertingService();
        });

        $this->app->singleton(QueryOptimizationService::class, function ($app) {
            return new QueryOptimizationService();
        });

        $this->app->singleton(QueueHealthMonitoringService::class, function ($app) {
            return new QueueHealthMonitoringService($app->make('queue'));
        });

        $this->app->singleton(TestingStrategyService::class, function ($app) {
            return new TestingStrategyService();
        });

        // Register event system services
        $this->app->singleton(EventStore::class, function ($app) {
            return new EventStore();
        });

        $this->app->singleton(EventDispatcher::class, function ($app) {
            return new EventDispatcher($app->make(EventStore::class));
        });

        // Register transaction manager
        $this->app->singleton(TransactionManager::class, function ($app) {
            return new TransactionManager();
        });

        // Register cache service
        $this->app->singleton(CacheService::class, function ($app) {
            return new CacheService();
        });

        // Register aliases for easier access
        $this->app->alias(APMMonitoringService::class, 'apm.monitor');
        $this->app->alias(AlertingService::class, 'system.alerts');
        $this->app->alias(QueryOptimizationService::class, 'query.optimizer');
        $this->app->alias(QueueHealthMonitoringService::class, 'queue.monitor');
        $this->app->alias(TestingStrategyService::class, 'testing.strategy');
        $this->app->alias(EventDispatcher::class, 'domain.events');
        $this->app->alias(TransactionManager::class, 'transaction.manager');
        $this->app->alias(CacheService::class, 'shared.cache');
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Register console commands
        if ($this->app->runningInConsole()) {
            $this->commands([
                \App\Shared\Console\Commands\TestSharedServicesCommand::class,
                \App\Shared\Console\Commands\MonitorSystemHealthCommand::class,
                \App\Shared\Console\Commands\CleanupOldSagasCommand::class,
            ]);
        }

        // Register event listeners for domain events
        $this->registerEventListeners();

        // Setup monitoring and alerts
        $this->setupMonitoring();
    }

    /**
     * Register event listeners for domain events.
     */
    protected function registerEventListeners(): void
    {
        // Enable slow query logging with proper error handling
        if (config('app.debug', false)) {
            try {
                // Check if database connection is available
                if ($this->app->bound('db') && DB::connection()->getPdo()) {
                    $queryOptimizer = $this->app->make(QueryOptimizationService::class);
                    $queryOptimizer->enableSlowQueryLogging(2.0); // Threshold: 2 seconds
                }
            } catch (\PDOException $e) {
                // Database not ready yet, skip slow query logging
                \Illuminate\Support\Facades\Log::debug('Database not ready for slow query logging: ' . $e->getMessage());
            } catch (\Exception $e) {
                // Log error but don't break the application
                \Illuminate\Support\Facades\Log::warning('Failed to enable slow query logging: ' . $e->getMessage());
            }
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
        // Register APM middleware with proper error handling
        try {
            // Only register in production or when explicitly enabled
            if (config('app.env') === 'production' || config('monitoring.apm.enabled', false)) {
                $kernel = $this->app->make(\Illuminate\Contracts\Http\Kernel::class);
                
                // Check if middleware class exists
                if (class_exists(\App\Shared\Http\Middleware\APMMiddleware::class)) {
                    $kernel->pushMiddleware(\App\Shared\Http\Middleware\APMMiddleware::class);
                }
            }
        } catch (\Exception $e) {
            // Log error but don't break the application
            \Illuminate\Support\Facades\Log::warning('Failed to register APM middleware: ' . $e->getMessage());
        }
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array<int, string>
     */
    public function provides(): array
    {
        return [
            APMMonitoringService::class,
            AlertingService::class,
            QueryOptimizationService::class,
            QueueHealthMonitoringService::class,
            TestingStrategyService::class,
            EventStore::class,
            EventDispatcher::class,
            TransactionManager::class,
            'apm.monitor',
            'system.alerts',
            'query.optimizer',
            'queue.monitor',
            'testing.strategy',
            'domain.events',
            'transaction.manager',
        ];
    }
}
