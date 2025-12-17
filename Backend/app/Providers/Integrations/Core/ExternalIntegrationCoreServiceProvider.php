<?php

namespace App\Providers\Integrations\Core;

use Illuminate\Support\ServiceProvider;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\RetryService;
use App\Services\OAuth1Service;

/**
 * 🚀 External Integration Core Service Provider
 * 
 * Registra serviços core de integração externa
 */
class ExternalIntegrationCoreServiceProvider extends ServiceProvider
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
            RateLimiterService::class,
            CircuitBreakerService::class,
            RetryService::class,
            OAuth1Service::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Rate Limiting Services - Core para todas as integrações
        $this->app->singleton(RateLimiterService::class, function ($app) {
            return new RateLimiterService();
        });

        $this->app->singleton(CircuitBreakerService::class, function ($app) {
            return new CircuitBreakerService();
        });

        $this->app->singleton(RetryService::class, function ($app) {
            return new RetryService();
        });

        // OAuth Services - Core para autenticação
        $this->app->singleton(OAuth1Service::class, function ($app) {
            return new OAuth1Service(
                config('services.twitter.consumer_key'),
                config('services.twitter.consumer_secret')
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
                // Adicionar comandos core aqui se necessário
            ]);
        }
    }
}