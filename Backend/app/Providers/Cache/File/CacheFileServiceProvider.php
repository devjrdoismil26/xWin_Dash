<?php

namespace App\Providers\Cache\File;

use Illuminate\Support\ServiceProvider;

/**
 * 📁 Cache File Service Provider
 * 
 * Registra serviços de cache em arquivo
 */
class CacheFileServiceProvider extends ServiceProvider
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
            \App\Services\Cache\FileCacheService::class,
            \App\Services\Cache\FileSystemService::class,
            \App\Services\Cache\FileCompressionService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para file cache service
        $this->app->bind(\App\Services\Cache\FileCacheService::class, function ($app) {
            return new \App\Services\Cache\FileCacheService();
        });

        // Binding para file system service
        $this->app->bind(\App\Services\Cache\FileSystemService::class, function ($app) {
            return new \App\Services\Cache\FileSystemService();
        });

        // Binding para file compression service
        $this->app->bind(\App\Services\Cache\FileCompressionService::class, function ($app) {
            return new \App\Services\Cache\FileCompressionService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('cache.file.enabled', true)) {
            // Setup file cache
            $this->setupFileCache();
        }
    }

    /**
     * Setup file cache.
     */
    protected function setupFileCache(): void
    {
        // Configure file cache settings
        $this->app->booted(function () {
            // Setup file cache configuration
        });
    }
}