<?php

namespace App\Domains\Activity\Providers;

use App\Domains\Activity\Domain\ActivityLogRepositoryInterface;
use App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogRepository;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class ActivityDomainServiceProvider extends BaseServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(ActivityLogRepositoryInterface::class, ActivityLogRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        $this->loadRoutesFrom(__DIR__ . '/../Http/routes.php');
    }
}
