<?php

namespace App\Domains\Universe\Providers\Data;

use Illuminate\Support\ServiceProvider;

/**
 * 📊 Universe Data Service Provider
 * 
 * Registra serviços de gerenciamento de dados do domínio Universe
 */
class UniverseDataServiceProvider extends ServiceProvider
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
            \App\Domains\Universe\Application\Services\UniverseDataService::class,
            \App\Domains\Universe\Application\Services\UniverseValidationService::class,
            \App\Domains\Universe\Application\Services\UniverseMigrationService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para service de dados
        $this->app->bind(
            \App\Domains\Universe\Application\Services\UniverseDataService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniverseDataService(
                    $app->make(\App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface::class)
                );
            }
        );

        // Binding para service de validação
        $this->app->bind(
            \App\Domains\Universe\Application\Services\UniverseValidationService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniverseValidationService();
            }
        );

        // Binding para service de migração
        $this->app->bind(
            \App\Domains\Universe\Application\Services\UniverseMigrationService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniverseMigrationService(
                    $app->make(\App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface::class)
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
        if (config('modules.universe.enabled', true)) {
            // Carregar migrations apenas se necessário
            if (config('modules.universe.load_migrations', true)) {
                $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
            }
        }
    }
}