<?php

namespace App\Domains\EmailMarketing\Observers;

use App\Domains\EmailMarketing\Events\EmailLogCreated;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailLogModel;

class EmailLogObserver
{
    /**
     * Handle the EmailLogModel "created" event.
     *
     * @param EmailLogModel $emailLog
     */
    public function created(EmailLogModel $emailLog): void
    {
        EmailLogCreated::dispatch($emailLog);
    }

    /**
     * Handle the EmailLogModel "updated" event.
     *
     * @param EmailLogModel $emailLog
     */
    public function updated(EmailLogModel $emailLog): void
    {
        //
    }

    /**
     * Handle the EmailLogModel "deleted" event.
     *
     * @param EmailLogModel $emailLog
     */
    public function deleted(EmailLogModel $emailLog): void
    {
        //
    }

    /**
     * Handle the EmailLogModel "restored" event.
     *
     * @param EmailLogModel $emailLog
     */
    public function restored(EmailLogModel $emailLog): void
    {
        //
    }

    /**
     * Handle the EmailLogModel "forceDeleted" event.
     *
     * @param EmailLogModel $emailLog
     */
    public function forceDeleted(EmailLogModel $emailLog): void
    {
        //
    }
}
