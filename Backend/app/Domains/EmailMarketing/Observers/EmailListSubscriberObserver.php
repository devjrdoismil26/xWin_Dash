<?php

namespace App\Domains\EmailMarketing\Observers;

use App\Domains\EmailMarketing\Events\EmailListSubscriberAttached;
use App\Domains\EmailMarketing\Events\EmailListSubscriberDetached;
use App\Domains\EmailMarketing\Events\EmailListSubscriberUpdated;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailListSubscriberModel;

class EmailListSubscriberObserver
{
    /**
     * Handle the EmailListSubscriberModel "created" event.
     *
     * @param EmailListSubscriberModel $emailListSubscriber
     */
    public function created(EmailListSubscriberModel $emailListSubscriber): void
    {
        EmailListSubscriberAttached::dispatch($emailListSubscriber);
    }

    /**
     * Handle the EmailListSubscriberModel "updated" event.
     *
     * @param EmailListSubscriberModel $emailListSubscriber
     */
    public function updated(EmailListSubscriberModel $emailListSubscriber): void
    {
        EmailListSubscriberUpdated::dispatch($emailListSubscriber);
    }

    /**
     * Handle the EmailListSubscriberModel "deleted" event.
     *
     * @param EmailListSubscriberModel $emailListSubscriber
     */
    public function deleted(EmailListSubscriberModel $emailListSubscriber): void
    {
        EmailListSubscriberDetached::dispatch($emailListSubscriber);
    }

    /**
     * Handle the EmailListSubscriberModel "restored" event.
     *
     * @param EmailListSubscriberModel $emailListSubscriber
     */
    public function restored(EmailListSubscriberModel $emailListSubscriber): void
    {
        //
    }

    /**
     * Handle the EmailListSubscriberModel "forceDeleted" event.
     *
     * @param EmailListSubscriberModel $emailListSubscriber
     */
    public function forceDeleted(EmailListSubscriberModel $emailListSubscriber): void
    {
        //
    }
}
