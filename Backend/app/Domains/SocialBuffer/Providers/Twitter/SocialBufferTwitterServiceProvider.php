<?php

namespace App\Domains\SocialBuffer\Providers\Twitter;

use Illuminate\Support\ServiceProvider;

/**
 * 🐦 Social Buffer Twitter Service Provider
 * 
 * Registra serviços específicos do Twitter
 */
class SocialBufferTwitterServiceProvider extends ServiceProvider
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
            \App\Domains\SocialBuffer\Services\Twitter\TwitterPostService::class,
            \App\Domains\SocialBuffer\Services\Twitter\TwitterThreadService::class,
            \App\Domains\SocialBuffer\Services\Twitter\TwitterAnalyticsService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para Twitter post service
        $this->app->bind(\App\Domains\SocialBuffer\Services\Twitter\TwitterPostService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\Twitter\TwitterPostService();
        });

        // Binding para Twitter thread service
        $this->app->bind(\App\Domains\SocialBuffer\Services\Twitter\TwitterThreadService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\Twitter\TwitterThreadService();
        });

        // Binding para Twitter analytics service
        $this->app->bind(\App\Domains\SocialBuffer\Services\Twitter\TwitterAnalyticsService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\Twitter\TwitterAnalyticsService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.social_buffer.enabled', true) && config('modules.social_buffer.twitter_enabled', true)) {
            // Registrar listeners de eventos do Twitter
            // Event::listen(TwitterEvent::class, TwitterListener::class);
        }
    }
}