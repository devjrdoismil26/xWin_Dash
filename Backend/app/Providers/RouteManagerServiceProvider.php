<?php

namespace App\Providers;

use App\Services\RouteManager;
use Illuminate\Support\ServiceProvider;

/**
 * 🚀 ROUTE MANAGER SERVICE PROVIDER
 * 
 * Registra e configura o sistema de gerenciamento de rotas
 */
class RouteManagerServiceProvider extends ServiceProvider
{
    /**
     * Indicates if the provider is deferred.
     * 
     * @var bool
     */
    protected $defer = false;

    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Registrar RouteManager como singleton
        $this->app->singleton(RouteManager::class, function ($app) {
            return new RouteManager();
        });

        // Registrar alias para facilitar uso
        $this->app->alias(RouteManager::class, 'route.manager');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Configurar sistema de rotas otimizado
        $this->configureOptimizedRoutes();
    }

    /**
     * Configurar sistema de rotas otimizado
     */
    protected function configureOptimizedRoutes(): void
    {
        // Verificar se RouteManager está habilitado
        if (config('route_manager.enabled', true)) {
            $routeManager = $this->app->make(RouteManager::class);
            
            // Carregar rotas de forma otimizada
            $routeManager->loadAllRoutes();
            
            // Log de inicialização (apenas em debug)
            if (config('app.debug')) {
                $stats = $routeManager->getRouteStats();
                \Log::info('RouteManager inicializado', $stats);
            }
        }
    }
}