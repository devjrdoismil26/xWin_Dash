<?php

namespace App\Domains\Analytics\Providers\Business;

use Illuminate\Support\ServiceProvider;

/**
 * 💼 Business Analytics Service Provider
 * 
 * Registra serviços de analytics de métricas de negócio
 */
class BusinessAnalyticsServiceProvider extends ServiceProvider
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
            \App\Domains\Analytics\Domain\AnalyticReportRepositoryInterface::class,
            \App\Domains\Analytics\Services\BusinessMetricsService::class,
            \App\Domains\Analytics\Services\RevenueAnalyticsService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para analytic report repository
        $this->app->bind(
            \App\Domains\Analytics\Domain\AnalyticReportRepositoryInterface::class,
            \App\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticReportRepository::class
        );

        // Binding para business metrics service
        $this->app->bind(\App\Domains\Analytics\Services\BusinessMetricsService::class, function ($app) {
            return new \App\Domains\Analytics\Services\BusinessMetricsService(
                $app->make(\App\Domains\Analytics\Domain\AnalyticReportRepositoryInterface::class)
            );
        });

        // Binding para revenue analytics service
        $this->app->bind(\App\Domains\Analytics\Services\RevenueAnalyticsService::class, function ($app) {
            return new \App\Domains\Analytics\Services\RevenueAnalyticsService(
                $app->make(\App\Domains\Analytics\Domain\AnalyticReportRepositoryInterface::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.analytics.enabled', true) && config('modules.analytics.business_enabled', true)) {
            // Carregar rotas apenas se necessário
            if (config('modules.analytics.load_routes', true)) {
                $this->loadRoutesFrom(__DIR__ . '/../../Http/routes.php');
            }

            // Registrar listeners de eventos de business analytics
            // Event::listen(BusinessAnalyticsEvent::class, BusinessAnalyticsListener::class);
        }
    }
}