<?php

namespace App\Domains\Universe\Providers\Core;

use App\Domains\Universe\Models\UniverseInstance;
use App\Domains\Universe\Observers\UniverseInstanceObserver;
use Illuminate\Support\ServiceProvider;

/**
 * 🌌 Universe Core Service Provider
 * 
 * Registra serviços core do domínio Universe
 */
class UniverseCoreServiceProvider extends ServiceProvider
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
            \App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface::class,
            \App\Domains\Universe\Application\Services\UniverseInstanceService::class,
            \App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceModel::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para repositório com lazy loading
        $this->app->bind(
            \App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface::class,
            function ($app) {
                return $app->make(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceRepository::class);
            }
        );

        // Binding para service principal com lazy loading
        $this->app->bind(
            \App\Domains\Universe\Application\Services\UniverseInstanceService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniverseInstanceService(
                    $app->make(\App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface::class)
                );
            }
        );

        // Binding para model apenas quando necessário
        $this->app->bind(
            \App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceModel::class,
            function ($app) {
                return new \App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceModel();
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
            // Registrar observers apenas se módulo estiver habilitado
            if (config('modules.universe.load_observers', true)) {
                UniverseInstance::observe(UniverseInstanceObserver::class);
            }
        }
    }
}