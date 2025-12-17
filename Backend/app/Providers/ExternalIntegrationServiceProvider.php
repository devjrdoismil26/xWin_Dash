<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\RetryService;
use App\Services\OAuth1Service;
use App\Services\AnalyticsService;
use App\Services\ContentSchedulingService;
use App\Domains\AI\Services\FunctionCallingService;

/**
 * 🚀 External Integration Service Provider
 * 
 * Registra todos os serviços de integração externa
 */
class ExternalIntegrationServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Rate Limiting Services
        $this->app->singleton(RateLimiterService::class, function ($app) {
            return new RateLimiterService();
        });

        $this->app->singleton(CircuitBreakerService::class, function ($app) {
            return new CircuitBreakerService();
        });

        $this->app->singleton(RetryService::class, function ($app) {
            return new RetryService();
        });

        // OAuth Services
        $this->app->singleton(OAuth1Service::class, function ($app) {
            return new OAuth1Service(
                config('services.twitter.consumer_key'),
                config('services.twitter.consumer_secret')
            );
        });

        // Analytics Services
        $this->app->singleton(AnalyticsService::class, function ($app) {
            return new AnalyticsService();
        });

        // Content Scheduling Services
        $this->app->singleton(ContentSchedulingService::class, function ($app) {
            return new ContentSchedulingService();
        });

        // AI Function Calling Services
        $this->app->singleton(FunctionCallingService::class, function ($app) {
            return new FunctionCallingService();
        });

        // ADStool Services
        $this->app->bind(\App\Domains\ADStool\Services\ExternalApi\FacebookAdsService::class, function ($app) {
            return new \App\Domains\ADStool\Services\ExternalApi\FacebookAdsService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        $this->app->bind(\App\Domains\ADStool\Services\ExternalApi\GoogleAdsService::class, function ($app) {
            return new \App\Domains\ADStool\Services\ExternalApi\GoogleAdsService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        $this->app->bind(\App\Domains\ADStool\Services\ExternalApi\InstagramAdsService::class, function ($app) {
            return new \App\Domains\ADStool\Services\ExternalApi\InstagramAdsService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // Aura Services
        $this->app->bind(\App\Domains\Aura\Services\WhatsAppTemplateService::class, function ($app) {
            return new \App\Domains\Aura\Services\WhatsAppTemplateService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        $this->app->bind(\App\Domains\Aura\Services\WhatsAppInteractiveService::class, function ($app) {
            return new \App\Domains\Aura\Services\WhatsAppInteractiveService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // SocialBuffer Services
        $this->app->bind(\App\Domains\SocialBuffer\Services\ExternalApi\TwitterService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\ExternalApi\TwitterService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        $this->app->bind(\App\Domains\SocialBuffer\Services\ExternalApi\FacebookService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\ExternalApi\FacebookService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        $this->app->bind(\App\Domains\SocialBuffer\Services\ExternalApi\InstagramService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\ExternalApi\InstagramService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        $this->app->bind(\App\Domains\SocialBuffer\Services\ExternalApi\LinkedInService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\ExternalApi\LinkedInService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        $this->app->bind(\App\Domains\SocialBuffer\Services\ExternalApi\TikTokService::class, function ($app) {
            return new \App\Domains\SocialBuffer\Services\ExternalApi\TikTokService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // AI Services
        $this->app->bind(\App\Domains\AI\Services\OpenAIService::class, function ($app) {
            return new \App\Domains\AI\Services\OpenAIService(
                $app->make(\App\Domains\AI\Services\ApiConfigurationService::class),
                $app->make(FunctionCallingService::class)
            );
        });

        $this->app->bind(\App\Domains\AI\Services\ClaudeService::class, function ($app) {
            return new \App\Domains\AI\Services\ClaudeService(
                $app->make(\App\Domains\AI\Services\ApiConfigurationService::class),
                $app->make(FunctionCallingService::class)
            );
        });

        $this->app->bind(\App\Domains\AI\Services\GeminiService::class, function ($app) {
            return new \App\Domains\AI\Services\GeminiService(
                $app->make(\App\Domains\AI\Services\ApiConfigurationService::class),
                $app->make(FunctionCallingService::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Registrar comandos Artisan se necessário
        if ($this->app->runningInConsole()) {
            $this->commands([
                // Adicionar comandos aqui se necessário
            ]);
        }

        // Registrar listeners de eventos se necessário
        // Event::listen(SomeEvent::class, SomeListener::class);
    }
}