<?php

namespace App\Domains\Projects\Providers;

use App\Domains\Projects\Domain\LandingPageRepositoryInterface;
use App\Domains\Projects\Domain\LeadCaptureFormRepositoryInterface;
use App\Domains\Projects\Domain\ProjectRepositoryInterface;
use App\Domains\Projects\Domain\TaskRepositoryInterface;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\LandingPageRepository;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\LeadCaptureFormRepository;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectRepository;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\TaskRepository;
use App\Domains\Projects\Services\UniverseIntegrationService;
use App\Domains\Universe\Services\UniverseManagementService;
use Illuminate\Support\ServiceProvider;

class ProjectsDomainServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(
            LandingPageRepositoryInterface::class,
            LandingPageRepository::class,
        );

        $this->app->bind(
            LeadCaptureFormRepositoryInterface::class,
            LeadCaptureFormRepository::class,
        );

        $this->app->bind(
            ProjectRepositoryInterface::class,
            ProjectRepository::class,
        );

        $this->app->bind(
            TaskRepositoryInterface::class,
            TaskRepository::class,
        );

        // Register Universe Integration Service
        $this->app->singleton(UniverseIntegrationService::class, function ($app) {
            return new UniverseIntegrationService(
                $app->make(UniverseManagementService::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
