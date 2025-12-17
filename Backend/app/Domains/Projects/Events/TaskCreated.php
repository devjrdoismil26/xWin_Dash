<?php

namespace App\Domains\Projects\Events;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\TaskModel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskCreated
{
    use Dispatchable;
    use SerializesModels;

    public TaskModel $task;

    /**
     * Create a new event instance.
     */
    public function __construct(TaskModel $task)
    {
        $this->task = $task;
    }
}
