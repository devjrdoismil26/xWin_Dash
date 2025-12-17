<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Fix para MySQL com versões antigas
        Schema::defaultStringLength(191);
        
        // Configurações específicas do xWin Dash
        $this->configureApp();
    }

    /**
     * Configure application-specific settings
     */
    private function configureApp(): void
    {
        // Configurações de timezone
        date_default_timezone_set(config('app.timezone', 'UTC'));
        
        // Configurações de locale
        app()->setLocale(config('app.locale', 'pt_BR'));
    }
}