<?php

namespace App\Providers\Integrations\Analytics;

use Illuminate\Support\ServiceProvider;
use App\Services\AnalyticsService;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\RetryService;

/**
 * 📊 Analytics Integration Service Provider
 * 
 * Registra serviços de integração com plataformas de analytics
 */
class AnalyticsIntegrationServiceProvider extends ServiceProvider
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
            AnalyticsService::class,
            \App\Services\Analytics\GoogleAnalyticsService::class,
            \App\Services\Analytics\FacebookPixelService::class,
            \App\Services\Analytics\MixpanelService::class,
            \App\Services\Analytics\HotjarService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Core Analytics Service
        $this->app->singleton(AnalyticsService::class, function ($app) {
            return new AnalyticsService();
        });

        // Google Analytics Service
        $this->app->bind(\App\Services\Analytics\GoogleAnalyticsService::class, function ($app) {
            return new \App\Services\Analytics\GoogleAnalyticsService(
                config('services.google_analytics.measurement_id'),
                config('services.google_analytics.api_secret'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // Facebook Pixel Service
        $this->app->bind(\App\Services\Analytics\FacebookPixelService::class, function ($app) {
            return new \App\Services\Analytics\FacebookPixelService(
                config('services.facebook.pixel_id'),
                config('services.facebook.access_token'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // Mixpanel Service
        $this->app->bind(\App\Services\Analytics\MixpanelService::class, function ($app) {
            return new \App\Services\Analytics\MixpanelService(
                config('services.mixpanel.project_token'),
                config('services.mixpanel.api_secret'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // Hotjar Service
        $this->app->bind(\App\Services\Analytics\HotjarService::class, function ($app) {
            return new \App\Services\Analytics\HotjarService(
                config('services.hotjar.site_id'),
                config('services.hotjar.api_key'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('integrations.analytics.enabled', true)) {
            // Registrar listeners de eventos específicos de analytics
            // Event::listen(AnalyticsEvent::class, AnalyticsListener::class);
        }
    }
}