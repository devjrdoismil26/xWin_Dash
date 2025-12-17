<?php

namespace App\Domains\Universe\Providers\Analytics;

use Illuminate\Support\ServiceProvider;

/**
 * 📈 Universe Analytics Service Provider
 * 
 * Registra serviços de analytics e relatórios do domínio Universe
 */
class UniverseAnalyticsServiceProvider extends ServiceProvider
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
            \App\Domains\Universe\Application\Services\UniverseAnalyticsService::class,
            \App\Domains\Universe\Application\Services\UniverseReportingService::class,
            \App\Domains\Universe\Application\Services\UniverseMetricsService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para service de analytics
        $this->app->bind(
            \App\Domains\Universe\Application\Services\UniverseAnalyticsService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniverseAnalyticsService(
                    $app->make(\App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface::class)
                );
            }
        );

        // Binding para service de relatórios
        $this->app->bind(
            \App\Domains\Universe\Application\Services\UniverseReportingService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniverseReportingService(
                    $app->make(\App\Domains\Universe\Application\Services\UniverseAnalyticsService::class)
                );
            }
        );

        // Binding para service de métricas
        $this->app->bind(
            \App\Domains\Universe\Application\Services\UniverseMetricsService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniverseMetricsService(
                    $app->make(\App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface::class)
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
        if (config('modules.universe.enabled', true) && config('modules.universe.analytics_enabled', true)) {
            // Registrar listeners de eventos de analytics
            // Event::listen(UniverseEvent::class, UniverseAnalyticsListener::class);
        }
    }
}