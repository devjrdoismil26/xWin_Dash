<?php

namespace App\Providers\Cache\Core;

use Illuminate\Support\ServiceProvider;
use App\Shared\Services\CacheService;

/**
 * 💾 Cache Core Service Provider
 * 
 * Registra serviços core de cache
 */
class CacheCoreServiceProvider extends ServiceProvider
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
            CacheService::class,
            'shared.cache',
            \App\Services\Cache\CacheManager::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Register cache service as singleton
        $this->app->singleton(CacheService::class, function ($app) {
            return new CacheService();
        });

        // Register alias for easier access
        $this->app->alias(CacheService::class, 'shared.cache');

        // Binding para cache manager
        $this->app->bind(\App\Services\Cache\CacheManager::class, function ($app) {
            return new \App\Services\Cache\CacheManager();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('cache.core.enabled', true)) {
            // Setup cache system
            $this->setupCacheSystem();
        }
    }

    /**
     * Setup cache system.
     */
    protected function setupCacheSystem(): void
    {
        // Configure cache settings
        $this->app->booted(function () {
            // Setup cache configuration
            // Cache::extend('custom', function ($app, $config) {
            //     return new CustomCacheDriver($config);
            // });
        });
    }
}