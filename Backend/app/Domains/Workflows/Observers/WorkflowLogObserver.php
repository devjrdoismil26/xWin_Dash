<?php

namespace App\Domains\Workflows\Observers;

use App\Domains\Workflows\Enums\WorkflowLogStatus;
use App\Domains\Workflows\Events\WorkflowLogCompleted;
use App\Domains\Workflows\Events\WorkflowLogCreated;
use App\Domains\Workflows\Events\WorkflowLogFailed;
use App\Domains\Workflows\Events\WorkflowLogUpdated;
use App\Domains\Workflows\Models\WorkflowLog;

class WorkflowLogObserver
{
    /**
     * Handle the WorkflowLog "created" event.
     */
    public function created(WorkflowLog $workflowLog): void
    {
        if (class_exists('App\\Domains\\Workflows\\Events\\WorkflowLogCreated')) {
            WorkflowLogCreated::dispatch($workflowLog);
        }
    }

    /**
     * Handle the WorkflowLog "updated" event.
     */
    public function updated(WorkflowLog $workflowLog): void
    {
        if (class_exists('App\\Domains\\Workflows\\Events\\WorkflowLogUpdated')) {
            WorkflowLogUpdated::dispatch($workflowLog);
        }

        if (method_exists($workflowLog, 'isDirty') && $workflowLog->isDirty('status')) {
            if (enum_exists('App\\Domains\\Workflows\\Enums\\WorkflowLogStatus')) {
                $status = $workflowLog->status;
                if (is_string($status)) {
                    if ($status === 'completed' && class_exists('App\\Domains\\Workflows\\Events\\WorkflowLogCompleted')) {
                        WorkflowLogCompleted::dispatch($workflowLog);
                    } elseif ($status === 'failed' && class_exists('App\\Domains\\Workflows\\Events\\WorkflowLogFailed')) {
                        WorkflowLogFailed::dispatch($workflowLog);
                    }
                } elseif ($status instanceof WorkflowLogStatus) {
                    if ($status === WorkflowLogStatus::Completed && class_exists('App\\Domains\\Workflows\\Events\\WorkflowLogCompleted')) {
                        WorkflowLogCompleted::dispatch($workflowLog);
                    } elseif ($status === WorkflowLogStatus::Failed && class_exists('App\\Domains\\Workflows\\Events\\WorkflowLogFailed')) {
                        WorkflowLogFailed::dispatch($workflowLog);
                    }
                }
            }
        }
    }

    /**
     * Handle the WorkflowLog "deleted" event.
     */
    public function deleted(WorkflowLog $workflowLog): void
    {
        // WorkflowLogDeleted::dispatch($workflowLog);
    }

    /**
     * Handle the WorkflowLog "restored" event.
     */
    public function restored(WorkflowLog $workflowLog): void
    {
        // WorkflowLogRestored::dispatch($workflowLog);
    }

    /**
     * Handle the WorkflowLog "forceDeleted" event.
     */
    public function forceDeleted(WorkflowLog $workflowLog): void
    {
        // WorkflowLogForceDeleted::dispatch($workflowLog);
    }
}
