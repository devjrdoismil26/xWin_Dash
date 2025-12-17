<?php

namespace App\Domains\SocialBuffer\Providers\Instagram;

use Illuminate\Support\ServiceProvider;

/**
 * 📸 Social Buffer Instagram Service Provider
 * 
 * Registra serviços específicos do Instagram
 */
class SocialBufferInstagramServiceProvider extends ServiceProvider
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
            \App\Domains\SocialBuffer\Services\Instagram\InstagramPostService::class,
            \App\Domains\SocialBuffer\Services\Instagram\InstagramStoryService::class,
            \App\Domains\SocialBuffer\Services\Instagram\InstagramReelService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para Instagram post service
        $this->app->bind(\App\Domains\SocialBuffer\Services\Instagram\InstagramPostService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\Instagram\InstagramPostService();
        });

        // Binding para Instagram story service
        $this->app->bind(\App\Domains\SocialBuffer\Services\Instagram\InstagramStoryService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\Instagram\InstagramStoryService();
        });

        // Binding para Instagram reel service
        $this->app->bind(\App\Domains\SocialBuffer\Services\Instagram\InstagramReelService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\Instagram\InstagramReelService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.social_buffer.enabled', true) && config('modules.social_buffer.instagram_enabled', true)) {
            // Registrar listeners de eventos do Instagram
            // Event::listen(InstagramEvent::class, InstagramListener::class);
        }
    }
}