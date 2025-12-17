<?php

namespace App\Providers\Cache\Redis;

use Illuminate\Support\ServiceProvider;

/**
 * 🔴 Cache Redis Service Provider
 * 
 * Registra serviços de cache Redis
 */
class CacheRedisServiceProvider extends ServiceProvider
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
            \App\Services\Cache\RedisCacheService::class,
            \App\Services\Cache\RedisConnectionService::class,
            \App\Services\Cache\RedisClusterService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para Redis cache service
        $this->app->bind(\App\Services\Cache\RedisCacheService::class, function ($app) {
            return new \App\Services\Cache\RedisCacheService();
        });

        // Binding para Redis connection service
        $this->app->bind(\App\Services\Cache\RedisConnectionService::class, function ($app) {
            return new \App\Services\Cache\RedisConnectionService();
        });

        // Binding para Redis cluster service
        $this->app->bind(\App\Services\Cache\RedisClusterService::class, function ($app) {
            return new \App\Services\Cache\RedisClusterService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('cache.redis.enabled', true)) {
            // Setup Redis cache
            $this->setupRedisCache();
        }
    }

    /**
     * Setup Redis cache.
     */
    protected function setupRedisCache(): void
    {
        // Configure Redis cache settings
        $this->app->booted(function () {
            // Setup Redis configuration
        });
    }
}