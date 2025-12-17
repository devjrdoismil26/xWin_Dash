<?php

namespace App\Domains\Leads\Observers;

use App\Domains\Leads\Events\SegmentCreated;
use App\Domains\Leads\Events\SegmentDeleted;
use App\Domains\Leads\Events\SegmentUpdated;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\SegmentModel;

class SegmentObserver
{
    /**
     * Handle the SegmentModel "created" event.
     *
     * @param SegmentModel $segment
     */
    public function created(SegmentModel $segment)
    {
        SegmentCreated::dispatch($segment->toDomainEntity());
    }

    /**
     * Handle the SegmentModel "updated" event.
     *
     * @param SegmentModel $segment
     */
    public function updated(SegmentModel $segment)
    {
        SegmentUpdated::dispatch($segment->toDomainEntity());
    }

    /**
     * Handle the SegmentModel "deleted" event.
     *
     * @param SegmentModel $segment
     */
    public function deleted(SegmentModel $segment)
    {
        SegmentDeleted::dispatch($segment->toDomainEntity());
    }

    /**
     * Handle the SegmentModel "restored" event.
     *
     * @param SegmentModel $segment
     */
    public function restored(SegmentModel $segment)
    {
        //
    }

    /**
     * Handle the SegmentModel "forceDeleted" event.
     *
     * @param SegmentModel $segment
     */
    public function forceDeleted(SegmentModel $segment)
    {
        //
    }
}
