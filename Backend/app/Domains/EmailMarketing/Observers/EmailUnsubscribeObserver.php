<?php

namespace App\Domains\EmailMarketing\Observers;

use App\Domains\EmailMarketing\Events\EmailUnsubscribeCreated;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailUnsubscribeModel;

class EmailUnsubscribeObserver
{
    /**
     * Handle the EmailUnsubscribeModel "created" event.
     *
     * @param EmailUnsubscribeModel $emailUnsubscribe
     */
    public function created(EmailUnsubscribeModel $emailUnsubscribe): void
    {
        EmailUnsubscribeCreated::dispatch($emailUnsubscribe);
    }

    /**
     * Handle the EmailUnsubscribeModel "updated" event.
     *
     * @param EmailUnsubscribeModel $emailUnsubscribe
     */
    public function updated(EmailUnsubscribeModel $emailUnsubscribe): void
    {
        //
    }

    /**
     * Handle the EmailUnsubscribeModel "deleted" event.
     *
     * @param EmailUnsubscribeModel $emailUnsubscribe
     */
    public function deleted(EmailUnsubscribeModel $emailUnsubscribe): void
    {
        //
    }

    /**
     * Handle the EmailUnsubscribeModel "restored" event.
     *
     * @param EmailUnsubscribeModel $emailUnsubscribe
     */
    public function restored(EmailUnsubscribeModel $emailUnsubscribe): void
    {
        //
    }

    /**
     * Handle the EmailUnsubscribeModel "forceDeleted" event.
     *
     * @param EmailUnsubscribeModel $emailUnsubscribe
     */
    public function forceDeleted(EmailUnsubscribeModel $emailUnsubscribe): void
    {
        //
    }
}
