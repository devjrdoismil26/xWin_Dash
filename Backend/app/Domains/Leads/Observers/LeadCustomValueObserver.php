<?php

namespace App\Domains\Leads\Observers;

use App\Domains\Leads\Events\LeadCustomValueCreated;
use App\Domains\Leads\Events\LeadCustomValueDeleted;
use App\Domains\Leads\Events\LeadCustomValueUpdated;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadCustomValueModel;

class LeadCustomValueObserver
{
    /**
     * Handle the LeadCustomValueModel "created" event.
     *
     * @param LeadCustomValueModel $leadCustomValue
     */
    public function created(LeadCustomValueModel $leadCustomValue)
    {
        LeadCustomValueCreated::dispatch($leadCustomValue->toDomainEntity());
    }

    /**
     * Handle the LeadCustomValueModel "updated" event.
     *
     * @param LeadCustomValueModel $leadCustomValue
     */
    public function updated(LeadCustomValueModel $leadCustomValue)
    {
        LeadCustomValueUpdated::dispatch($leadCustomValue->toDomainEntity());
    }

    /**
     * Handle the LeadCustomValueModel "deleted" event.
     *
     * @param LeadCustomValueModel $leadCustomValue
     */
    public function deleted(LeadCustomValueModel $leadCustomValue)
    {
        LeadCustomValueDeleted::dispatch($leadCustomValue->toDomainEntity());
    }

    /**
     * Handle the LeadCustomValueModel "restored" event.
     *
     * @param LeadCustomValueModel $leadCustomValue
     */
    public function restored(LeadCustomValueModel $leadCustomValue)
    {
        //
    }

    /**
     * Handle the LeadCustomValueModel "forceDeleted" event.
     *
     * @param LeadCustomValueModel $leadCustomValue
     */
    public function forceDeleted(LeadCustomValueModel $leadCustomValue)
    {
        //
    }
}
