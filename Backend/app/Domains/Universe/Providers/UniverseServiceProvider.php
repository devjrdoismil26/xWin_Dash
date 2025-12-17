<?php

namespace App\Domains\Universe\Providers;

use App\Domains\Universe\Models\UniverseInstance;
use App\Domains\Universe\Observers\UniverseInstanceObserver;
use Illuminate\Support\ServiceProvider;

class UniverseServiceProvider extends ServiceProvider
{
    /**
     * Indicates if the provider is deferred.
     * 
     * @var bool
     */
    protected $defer = true;

    /**
     * The services that are provided by this provider.
     *
     * @var array
     */
    protected $provides = [
        // Repositório essencial
        \App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface::class,
        
        // Service essencial
        \App\Domains\Universe\Application\Services\UniverseInstanceService::class,
        
        // Services de performance (singletons)
        \App\Domains\Universe\Application\Services\UniverseCacheService::class,
        \App\Domains\Universe\Application\Services\UniversePerformanceService::class,
    ];
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // 🚀 OTIMIZADO: Binding para repositório com lazy loading
        $this->app->bind(
            \App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface::class,
            function ($app) {
                return $app->make(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceRepository::class);
            }
        );

        // 🚀 OTIMIZADO: Binding para service principal com lazy loading
        $this->app->bind(
            \App\Domains\Universe\Application\Services\UniverseInstanceService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniverseInstanceService(
                    $app->make(\App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface::class)
                );
            }
        );

        // 🚀 OTIMIZADO: Binding para model apenas quando necessário
        $this->app->bind(
            \App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceModel::class,
            function ($app) {
                return new \App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceModel();
            }
        );

        // 🚀 OTIMIZADO: Singletons para services de performance com lazy loading
        $this->app->singleton(
            \App\Domains\Universe\Application\Services\UniverseCacheService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniverseCacheService();
            }
        );

        $this->app->singleton(
            \App\Domains\Universe\Application\Services\UniversePerformanceService::class,
            function ($app) {
                return new \App\Domains\Universe\Application\Services\UniversePerformanceService(
                    $app->make(\App\Domains\Universe\Application\Services\UniverseCacheService::class)
                );
            }
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 🚀 OTIMIZADO: Carregar rotas apenas se módulo Universe estiver habilitado
        if (config('modules.universe.enabled', true)) {
            // Carregar rotas API apenas se necessário
            if (config('modules.universe.load_api_routes', true)) {
                $this->loadRoutesFrom(__DIR__ . '/../routes/api.php');
            }
            
            // Carregar rotas Web apenas se necessário
            if (config('modules.universe.load_web_routes', false)) {
                $this->loadRoutesFrom(__DIR__ . '/../routes/web.php');
            }
        }

        // 🚀 OTIMIZADO: Registrar observers apenas se módulo estiver habilitado
        if (config('modules.universe.enabled', true) && config('modules.universe.load_observers', true)) {
            UniverseInstance::observe(UniverseInstanceObserver::class);
        }
    }
}
