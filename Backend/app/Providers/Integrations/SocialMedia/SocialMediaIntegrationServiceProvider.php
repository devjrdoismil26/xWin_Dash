<?php

namespace App\Providers\Integrations\SocialMedia;

use Illuminate\Support\ServiceProvider;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\RetryService;

/**
 * 📱 Social Media Integration Service Provider
 * 
 * Registra serviços de integração com redes sociais
 */
class SocialMediaIntegrationServiceProvider extends ServiceProvider
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
            \App\Domains\SocialBuffer\Services\ExternalApi\TwitterService::class,
            \App\Domains\SocialBuffer\Services\ExternalApi\FacebookService::class,
            \App\Domains\SocialBuffer\Services\ExternalApi\InstagramService::class,
            \App\Domains\SocialBuffer\Services\ExternalApi\LinkedInService::class,
            \App\Domains\SocialBuffer\Services\ExternalApi\TikTokService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // SocialBuffer Services - Twitter
        $this->app->bind(\App\Domains\SocialBuffer\Services\ExternalApi\TwitterService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\ExternalApi\TwitterService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // SocialBuffer Services - Facebook
        $this->app->bind(\App\Domains\SocialBuffer\Services\ExternalApi\FacebookService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\ExternalApi\FacebookService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // SocialBuffer Services - Instagram
        $this->app->bind(\App\Domains\SocialBuffer\Services\ExternalApi\InstagramService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\ExternalApi\InstagramService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // SocialBuffer Services - LinkedIn
        $this->app->bind(\App\Domains\SocialBuffer\Services\ExternalApi\LinkedInService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\ExternalApi\LinkedInService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // SocialBuffer Services - TikTok
        $this->app->bind(\App\Domains\SocialBuffer\Services\ExternalApi\TikTokService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\ExternalApi\TikTokService(
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
        if (config('integrations.social_media.enabled', true)) {
            // Registrar listeners de eventos específicos de redes sociais
            // Event::listen(SocialMediaEvent::class, SocialMediaListener::class);
        }
    }
}