<?php

namespace App\Domains\Workflows\Providers;

use App\Application\Workflows\Listeners\ProcessWorkflowListener;
use App\Domains\Workflows\Events\WorkflowCreated;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowLogModel as WorkflowLog;
use App\Domains\Workflows\Observers\WorkflowLogObserver;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        WorkflowCreated::class => [
            ProcessWorkflowListener::class,
        ],
        \App\Domains\Workflows\Events\WorkflowCompleted::class => [
            \App\Domains\Workflows\Listeners\SendWorkflowCompletedNotification::class,
        ],
    ];

    public function boot(): void
    {
        WorkflowLog::observe(WorkflowLogObserver::class);
    }
}
