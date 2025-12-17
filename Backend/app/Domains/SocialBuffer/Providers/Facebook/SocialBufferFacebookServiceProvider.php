<?php

namespace App\Domains\SocialBuffer\Providers\Facebook;

use Illuminate\Support\ServiceProvider;

/**
 * 📘 Social Buffer Facebook Service Provider
 * 
 * Registra serviços específicos do Facebook
 */
class SocialBufferFacebookServiceProvider extends ServiceProvider
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
            \App\Domains\SocialBuffer\Services\Facebook\FacebookPostService::class,
            \App\Domains\SocialBuffer\Services\Facebook\FacebookAnalyticsService::class,
            \App\Domains\SocialBuffer\Services\Facebook\FacebookMediaService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para Facebook post service
        $this->app->bind(\App\Domains\SocialBuffer\Services\Facebook\FacebookPostService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\Facebook\FacebookPostService();
        });

        // Binding para Facebook analytics service
        $this->app->bind(\App\Domains\SocialBuffer\Services\Facebook\FacebookAnalyticsService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\Facebook\FacebookAnalyticsService();
        });

        // Binding para Facebook media service
        $this->app->bind(\App\Domains\SocialBuffer\Services\Facebook\FacebookMediaService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\Facebook\FacebookMediaService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.social_buffer.enabled', true) && config('modules.social_buffer.facebook_enabled', true)) {
            // Registrar listeners de eventos do Facebook
            // Event::listen(FacebookEvent::class, FacebookListener::class);
        }
    }
}