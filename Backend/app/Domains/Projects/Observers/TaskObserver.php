<?php

namespace App\Domains\Projects\Observers;

use App\Domains\Projects\Events\TaskCreated;
use App\Domains\Projects\Events\TaskDeleted;
use App\Domains\Projects\Events\TaskUpdated;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\TaskModel as Task;

class TaskObserver
{
    /**
     * Handle the Task "created" event.
     */
    public function created(Task $task): void
    {
        event(new TaskCreated($task));
    }

    /**
     * Handle the Task "updated" event.
     */
    public function updated(Task $task): void
    {
        event(new TaskUpdated($task));
    }

    /**
     * Handle the Task "deleted" event.
     */
    public function deleted(Task $task): void
    {
        event(new TaskDeleted($task));
    }
}
