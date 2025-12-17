<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domains\Workflows\Domain\Repositories\WorkflowRepositoryInterface;
use App\Domains\Workflows\Repositories\WorkflowRepository;
use App\Domains\Workflows\Domain\Services\WorkflowServiceInterface;
use App\Domains\Workflows\Application\Services\WorkflowService;

class WorkflowServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(WorkflowRepositoryInterface::class, WorkflowRepository::class);
        $this->app->bind(WorkflowServiceInterface::class, WorkflowService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
