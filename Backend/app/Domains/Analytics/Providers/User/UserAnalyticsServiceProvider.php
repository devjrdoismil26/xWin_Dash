<?php

namespace App\Domains\Analytics\Providers\User;

use Illuminate\Support\ServiceProvider;

/**
 * 👥 User Analytics Service Provider
 * 
 * Registra serviços de analytics de comportamento do usuário
 */
class UserAnalyticsServiceProvider extends ServiceProvider
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
            \App\Domains\Analytics\Services\UserBehaviorService::class,
            \App\Domains\Analytics\Services\UserJourneyService::class,
            \App\Domains\Analytics\Services\UserEngagementService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para user behavior service
        $this->app->bind(\App\Domains\Analytics\Services\UserBehaviorService::class, function ($app) {
            return new \App\Domains\Analytics\Services\UserBehaviorService();
        });

        // Binding para user journey service
        $this->app->bind(\App\Domains\Analytics\Services\UserJourneyService::class, function ($app) {
            return new \App\Domains\Analytics\Services\UserJourneyService();
        });

        // Binding para user engagement service
        $this->app->bind(\App\Domains\Analytics\Services\UserEngagementService::class, function ($app) {
            return new \App\Domains\Analytics\Services\UserEngagementService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.analytics.enabled', true) && config('modules.analytics.user_enabled', true)) {
            // Registrar listeners de eventos de user analytics
            // Event::listen(UserAnalyticsEvent::class, UserAnalyticsListener::class);
        }
    }
}