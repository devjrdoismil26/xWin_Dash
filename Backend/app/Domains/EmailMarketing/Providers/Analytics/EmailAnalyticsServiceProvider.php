<?php

namespace App\Domains\EmailMarketing\Providers\Analytics;

use Illuminate\Support\ServiceProvider;

/**
 * 📊 Email Analytics Service Provider
 * 
 * Registra serviços de analytics e relatórios de email marketing
 */
class EmailAnalyticsServiceProvider extends ServiceProvider
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
            \App\Domains\EmailMarketing\Services\EmailAnalyticsService::class,
            \App\Domains\EmailMarketing\Contracts\EmailMetricRepositoryInterface::class,
            \App\Domains\EmailMarketing\Contracts\EmailLogRepositoryInterface::class,
            \App\Domains\EmailMarketing\Contracts\EmailBounceRepositoryInterface::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para analytics service
        $this->app->bind(
            \App\Domains\EmailMarketing\Services\EmailAnalyticsService::class,
            function ($app) {
                return new \App\Domains\EmailMarketing\Services\EmailAnalyticsService(
                    $app->make(\App\Domains\EmailMarketing\Contracts\EmailMetricRepositoryInterface::class),
                    $app->make(\App\Domains\EmailMarketing\Contracts\EmailLogRepositoryInterface::class)
                );
            }
        );

        // Binding para metric repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailMetricRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailMetricRepository::class
        );

        // Binding para log repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailLogRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailLogRepository::class
        );

        // Binding para bounce repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailBounceRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailBounceRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.email_marketing.enabled', true) && config('modules.email_marketing.analytics_enabled', true)) {
            // Registrar listeners de eventos de analytics
            // Event::listen(EmailAnalyticsEvent::class, EmailAnalyticsListener::class);
        }
    }
}