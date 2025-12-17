<?php

namespace App\Domains\Core\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // O User model global está disponível em App\Models\User
        // que estende o UserModel do domínio Users mantendo a arquitetura DDD
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
