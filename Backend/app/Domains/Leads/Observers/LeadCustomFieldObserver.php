<?php

namespace App\Domains\Leads\Observers;

use App\Domains\Leads\Events\LeadCustomFieldCreated;
use App\Domains\Leads\Events\LeadCustomFieldDeleted;
use App\Domains\Leads\Events\LeadCustomFieldUpdated;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadCustomFieldModel;

class LeadCustomFieldObserver
{
    /**
     * Handle the LeadCustomFieldModel "created" event.
     *
     * @param LeadCustomFieldModel $leadCustomField
     */
    public function created(LeadCustomFieldModel $leadCustomField)
    {
        LeadCustomFieldCreated::dispatch($leadCustomField->toDomainEntity()); // Supondo um método toDomainEntity()
    }

    /**
     * Handle the LeadCustomFieldModel "updated" event.
     *
     * @param LeadCustomFieldModel $leadCustomField
     */
    public function updated(LeadCustomFieldModel $leadCustomField)
    {
        LeadCustomFieldUpdated::dispatch($leadCustomField->toDomainEntity());
    }

    /**
     * Handle the LeadCustomFieldModel "deleted" event.
     *
     * @param LeadCustomFieldModel $leadCustomField
     */
    public function deleted(LeadCustomFieldModel $leadCustomField)
    {
        LeadCustomFieldDeleted::dispatch($leadCustomField->toDomainEntity());
    }

    /**
     * Handle the LeadCustomFieldModel "restored" event.
     *
     * @param LeadCustomFieldModel $leadCustomField
     */
    public function restored(LeadCustomFieldModel $leadCustomField)
    {
        //
    }

    /**
     * Handle the LeadCustomFieldModel "forceDeleted" event.
     *
     * @param LeadCustomFieldModel $leadCustomField
     */
    public function forceDeleted(LeadCustomFieldModel $leadCustomField)
    {
        //
    }
}
