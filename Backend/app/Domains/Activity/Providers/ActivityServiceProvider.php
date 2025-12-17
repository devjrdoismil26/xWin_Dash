<?php

namespace App\Domains\Activity\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domains\Activity\Application\Services\ActivityLogService;
use App\Domains\Activity\Domain\Repositories\ActivityLogRepositoryInterface;
use App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogRepository;

class ActivityServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(
            ActivityLogRepositoryInterface::class,
            ActivityLogRepository::class
        );

        $this->app->singleton(ActivityLogService::class, function ($app) {
            return new ActivityLogService(
                $app->make(ActivityLogRepositoryInterface::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
