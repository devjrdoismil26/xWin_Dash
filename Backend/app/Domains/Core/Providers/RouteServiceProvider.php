<?php

namespace App\Domains\Core\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/dashboard';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot()
    {
        $this->configureRoutes();
    }

    /**
     * Configure the route for the application.
     */
    protected function configureRoutes()
    {
        // Carrega as rotas web principais da aplicação
        Route::middleware('web')
            ->group(base_path('routes/web.php'));

        // Carrega as rotas API
        Route::prefix('api')
            ->middleware('api')
            ->group(base_path('routes/api.php'));

        // Carrega as rotas específicas do Core
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('app/Domains/Core/Http/routes.php'));

        // 🚀 Carrega as rotas de integrações externas
        Route::middleware('api')
            ->group(base_path('routes/external_integrations.php'));
    }
}
