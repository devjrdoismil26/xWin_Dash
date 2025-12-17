<?php

namespace App\Domains\EmailMarketing\Observers;

use App\Domains\EmailMarketing\Events\EmailSegmentCreated;
use App\Domains\EmailMarketing\Events\EmailSegmentDeleted;
use App\Domains\EmailMarketing\Events\EmailSegmentUpdated;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailSegment;

class EmailSegmentObserver
{
    /**
     * Handle the EmailSegment "created" event.
     *
     * @param EmailSegment $emailSegment
     */
    public function created(EmailSegment $emailSegment): void
    {
        EmailSegmentCreated::dispatch($emailSegment);
    }

    /**
     * Handle the EmailSegment "updated" event.
     *
     * @param EmailSegment $emailSegment
     */
    public function updated(EmailSegment $emailSegment): void
    {
        EmailSegmentUpdated::dispatch($emailSegment);
    }

    /**
     * Handle the EmailSegment "deleted" event.
     *
     * @param EmailSegment $emailSegment
     */
    public function deleted(EmailSegment $emailSegment): void
    {
        EmailSegmentDeleted::dispatch($emailSegment);
    }

    /**
     * Handle the EmailSegment "restored" event.
     *
     * @param EmailSegment $emailSegment
     */
    public function restored(EmailSegment $emailSegment): void
    {
        //
    }

    /**
     * Handle the EmailSegment "forceDeleted" event.
     *
     * @param EmailSegment $emailSegment
     */
    public function forceDeleted(EmailSegment $emailSegment): void
    {
        //
    }
}
