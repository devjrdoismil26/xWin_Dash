<?php

namespace App\Domains\Analytics\Providers\Web;

use Illuminate\Support\ServiceProvider;

/**
 * 🌐 Web Analytics Service Provider
 * 
 * Registra serviços de analytics web
 */
class WebAnalyticsServiceProvider extends ServiceProvider
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
            \App\Domains\Analytics\Services\WebAnalyticsService::class,
            \App\Domains\Analytics\Services\PageViewService::class,
            \App\Domains\Analytics\Services\SessionService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para web analytics service
        $this->app->bind(\App\Domains\Analytics\Services\WebAnalyticsService::class, function ($app) {
            return new \App\Domains\Analytics\Services\WebAnalyticsService();
        });

        // Binding para page view service
        $this->app->bind(\App\Domains\Analytics\Services\PageViewService::class, function ($app) {
            return new \App\Domains\Analytics\Services\PageViewService();
        });

        // Binding para session service
        $this->app->bind(\App\Domains\Analytics\Services\SessionService::class, function ($app) {
            return new \App\Domains\Analytics\Services\SessionService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.analytics.enabled', true) && config('modules.analytics.web_enabled', true)) {
            // Registrar listeners de eventos de web analytics
            // Event::listen(WebAnalyticsEvent::class, WebAnalyticsListener::class);
        }
    }
}