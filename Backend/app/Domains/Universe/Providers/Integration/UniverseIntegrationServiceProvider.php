<?php

namespace App\Domains\Universe\Providers\Integration;

use Illuminate\Support\ServiceProvider;

/**
 * 🔗 Universe Integration Service Provider
 * 
 * Registra serviços de integração externa do domínio Universe
 */
class UniverseIntegrationServiceProvider extends ServiceProvider
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
            \App\Domains\Universe\Application\Services\UniverseCacheService::class,
            \App\Domains\Universe\Application\Services\UniversePerformanceService::class,
            \App\Domains\Universe\Application\Services\UniverseExternalApiService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Singleton para service de cache com lazy loading
        $this->app->singleton(
            \App\Domains\Universe\Application\Services\UniverseCacheService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniverseCacheService();
            }
        );

        // Singleton para service de performance com lazy loading
        $this->app->singleton(
            \App\Domains\Universe\Application\Services\UniversePerformanceService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniversePerformanceService(
                    $app->make(\App\Domains\Universe\Application\Services\UniverseCacheService::class)
                );
            }
        );

        // Binding para service de API externa
        $this->app->bind(
            \App\Domains\Universe\Application\Services\UniverseExternalApiService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniverseExternalApiService(
                    $app->make(\App\Domains\Universe\Application\Services\UniverseCacheService::class),
                    $app->make(\App\Domains\Universe\Application\Services\UniversePerformanceService::class)
                );
            }
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.universe.enabled', true) && config('modules.universe.integrations_enabled', true)) {
            // Registrar listeners de eventos de integração
            // Event::listen(UniverseIntegrationEvent::class, UniverseIntegrationListener::class);
        }
    }
}