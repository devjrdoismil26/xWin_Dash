<?php

namespace App\Providers\Shared\Alerting;

use Illuminate\Support\ServiceProvider;
use App\Infrastructure\Monitoring\AlertingService;

/**
 * 🚨 Alerting Service Provider
 * 
 * Registra serviços de alertas e notificações do sistema
 */
class AlertingServiceProvider extends ServiceProvider
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
            AlertingService::class,
            'system.alerts',
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Register alerting service as singleton
        $this->app->singleton(AlertingService::class, function ($app) {
            return new AlertingService();
        });

        // Register alias for easier access
        $this->app->alias(AlertingService::class, 'system.alerts');
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('shared.alerting.enabled', true)) {
            // Register console commands
            if ($this->app->runningInConsole()) {
                $this->commands([
                    \App\Shared\Console\Commands\TestSharedServicesCommand::class,
                ]);
            }

            // Setup alerting
            $this->setupAlerting();
        }
    }

    /**
     * Setup alerting system.
     */
    protected function setupAlerting(): void
    {
        // Register event listeners for system alerts
        $this->app->booted(function () {
            // Register alert listeners for critical system events
            // Event::listen(CriticalSystemEvent::class, AlertingService::class);
        });
    }
}