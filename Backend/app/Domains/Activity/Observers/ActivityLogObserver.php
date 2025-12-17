<?php

namespace App\Domains\Activity\Observers;

use App\Domains\Activity\Models\ActivityLog;

class ActivityLogObserver
{
    /**
     * Handle the ActivityLog "created" event.
     *
     * @param \App\Domains\Activity\Models\ActivityLog $activityLog
     */
    public function created(ActivityLog $activityLog)
    {
        // Exemplo: Disparar um evento customizado após a criação do log
        // ActivityLogged::dispatch($activityLog);
    }

    /**
     * Handle the ActivityLog "updated" event.
     *
     * @param \App\Domains\Activity\Models\ActivityLog $activityLog
     */
    public function updated(ActivityLog $activityLog)
    {
        //
    }

    /**
     * Handle the ActivityLog "deleted" event.
     *
     * @param \App\Domains\Activity\Models\ActivityLog $activityLog
     */
    public function deleted(ActivityLog $activityLog)
    {
        //
    }

    /**
     * Handle the ActivityLog "restored" event.
     *
     * @param \App\Domains\Activity\Models\ActivityLog $activityLog
     */
    public function restored(ActivityLog $activityLog)
    {
        //
    }

    /**
     * Handle the ActivityLog "forceDeleted" event.
     *
     * @param \App\Domains\Activity\Models\ActivityLog $activityLog
     */
    public function forceDeleted(ActivityLog $activityLog)
    {
        //
    }
}
