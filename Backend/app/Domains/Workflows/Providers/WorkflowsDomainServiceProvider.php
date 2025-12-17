<?php

namespace App\Domains\Workflows\Providers;

use App\Domains\Workflows\Domain\WorkflowExecutionRepositoryInterface;
use App\Domains\Workflows\Domain\WorkflowLeadRepositoryInterface;
use App\Domains\Workflows\Domain\WorkflowLogRepositoryInterface;
use App\Domains\Workflows\Domain\WorkflowNodeRepositoryInterface;
use App\Domains\Workflows\Domain\WorkflowRepositoryInterface;
use App\Domains\Workflows\Domain\WorkflowVersionRepositoryInterface;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionRepository;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowLeadRepository;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowLogRepository;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeRepository;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowRepository;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowVersionRepository;
use Illuminate\Support\ServiceProvider;

class WorkflowsDomainServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (class_exists('App\\Domains\\Workflows\\Infrastructure\\Persistence\\Eloquent\\WorkflowRepository')) {
            $this->app->bind(
                WorkflowRepositoryInterface::class,
                WorkflowRepository::class,
            );
        }

        $this->app->bind(
            WorkflowExecutionRepositoryInterface::class,
            WorkflowExecutionRepository::class,
        );

        $this->app->bind(
            WorkflowLeadRepositoryInterface::class,
            WorkflowLeadRepository::class,
        );

        $this->app->bind(
            WorkflowLogRepositoryInterface::class,
            WorkflowLogRepository::class,
        );

        $this->app->bind(
            WorkflowNodeRepositoryInterface::class,
            WorkflowNodeRepository::class,
        );

        $this->app->bind(
            WorkflowVersionRepositoryInterface::class,
            WorkflowVersionRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
