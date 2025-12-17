<?php

namespace App\Providers\Cache\Database;

use Illuminate\Support\ServiceProvider;

/**
 * 🗄️ Cache Database Service Provider
 * 
 * Registra serviços de cache em banco de dados
 */
class CacheDatabaseServiceProvider extends ServiceProvider
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
            \App\Services\Cache\DatabaseCacheService::class,
            \App\Services\Cache\CacheTableService::class,
            \App\Services\Cache\CacheCleanupService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para database cache service
        $this->app->bind(\App\Services\Cache\DatabaseCacheService::class, function ($app) {
            return new \App\Services\Cache\DatabaseCacheService();
        });

        // Binding para cache table service
        $this->app->bind(\App\Services\Cache\CacheTableService::class, function ($app) {
            return new \App\Services\Cache\CacheTableService();
        });

        // Binding para cache cleanup service
        $this->app->bind(\App\Services\Cache\CacheCleanupService::class, function ($app) {
            return new \App\Services\Cache\CacheCleanupService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('cache.database.enabled', true)) {
            // Setup database cache
            $this->setupDatabaseCache();
        }
    }

    /**
     * Setup database cache.
     */
    protected function setupDatabaseCache(): void
    {
        // Configure database cache settings
        $this->app->booted(function () {
            // Setup database cache configuration
        });
    }
}