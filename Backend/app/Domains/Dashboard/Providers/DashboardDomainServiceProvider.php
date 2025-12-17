<?php

namespace App\Domains\Dashboard\Providers;

use App\Domains\Dashboard\Domain\DashboardWidgetRepositoryInterface;
use App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\DashboardWidgetRepository;
use Illuminate\Support\ServiceProvider;

class DashboardDomainServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(
            DashboardWidgetRepositoryInterface::class,
            DashboardWidgetRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
