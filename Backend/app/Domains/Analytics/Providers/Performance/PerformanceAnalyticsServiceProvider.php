<?php

namespace App\Domains\Analytics\Providers\Performance;

use Illuminate\Support\ServiceProvider;

/**
 * ⚡ Performance Analytics Service Provider
 * 
 * Registra serviços de analytics de performance
 */
class PerformanceAnalyticsServiceProvider extends ServiceProvider
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
            \App\Domains\Analytics\Services\PerformanceMetricsService::class,
            \App\Domains\Analytics\Services\SystemHealthService::class,
            \App\Domains\Analytics\Services\ResourceUsageService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para performance metrics service
        $this->app->bind(\App\Domains\Analytics\Services\PerformanceMetricsService::class, function ($app) {
            return new \App\Domains\Analytics\Services\PerformanceMetricsService();
        });

        // Binding para system health service
        $this->app->bind(\App\Domains\Analytics\Services\SystemHealthService::class, function ($app) {
            return new \App\Domains\Analytics\Services\SystemHealthService();
        });

        // Binding para resource usage service
        $this->app->bind(\App\Domains\Analytics\Services\ResourceUsageService::class, function ($app) {
            return new \App\Domains\Analytics\Services\ResourceUsageService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.analytics.enabled', true) && config('modules.analytics.performance_enabled', true)) {
            // Registrar listeners de eventos de performance analytics
            // Event::listen(PerformanceAnalyticsEvent::class, PerformanceAnalyticsListener::class);
        }
    }
}