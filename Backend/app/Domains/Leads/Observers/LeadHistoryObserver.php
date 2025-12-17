<?php

namespace App\Domains\Leads\Observers;

use App\Domains\Leads\Events\LeadHistoryCreated;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadHistoryModel;

class LeadHistoryObserver
{
    /**
     * Handle the LeadHistoryModel "created" event.
     *
     * @param LeadHistoryModel $leadHistory
     */
    public function created(LeadHistoryModel $leadHistory)
    {
        LeadHistoryCreated::dispatch($leadHistory->toDomainEntity());
    }

    /**
     * Handle the LeadHistoryModel "updated" event.
     *
     * @param LeadHistoryModel $leadHistory
     */
    public function updated(LeadHistoryModel $leadHistory)
    {
        //
    }

    /**
     * Handle the LeadHistoryModel "deleted" event.
     *
     * @param LeadHistoryModel $leadHistory
     */
    public function deleted(LeadHistoryModel $leadHistory)
    {
        //
    }

    /**
     * Handle the LeadHistoryModel "restored" event.
     *
     * @param LeadHistoryModel $leadHistory
     */
    public function restored(LeadHistoryModel $leadHistory)
    {
        //
    }

    /**
     * Handle the LeadHistoryModel "forceDeleted" event.
     *
     * @param LeadHistoryModel $leadHistory
     */
    public function forceDeleted(LeadHistoryModel $leadHistory)
    {
        //
    }
}
