<?php

namespace App\Domains\Analytics\Providers;

use App\Domains\Analytics\Domain\AnalyticReportRepositoryInterface;
use App\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticReportRepository;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class AnalyticsDomainServiceProvider extends BaseServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(AnalyticReportRepositoryInterface::class, AnalyticReportRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        $this->loadRoutesFrom(__DIR__ . '/../Http/routes.php');
    }
}
