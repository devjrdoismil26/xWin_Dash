<?php

namespace App\Domains\Leads\Observers;

use App\Domains\Leads\Events\LeadEmailClicked;
use App\Domains\Leads\Events\LeadEmailOpened;
use App\Domains\Leads\Events\LeadEmailSent;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadEmailModel;

class LeadEmailObserver
{
    /**
     * Handle the LeadEmailModel "created" event.
     *
     * @param LeadEmailModel $leadEmail
     */
    public function created(LeadEmailModel $leadEmail)
    {
        LeadEmailSent::dispatch($leadEmail->lead->toDomainEntity(), $leadEmail->toDomainEntity());
    }

    /**
     * Handle the LeadEmailModel "updated" event.
     *
     * @param LeadEmailModel $leadEmail
     */
    public function updated(LeadEmailModel $leadEmail)
    {
        if ($leadEmail->isDirty('opened_at') && $leadEmail->opened_at !== null) {
            LeadEmailOpened::dispatch($leadEmail->lead->toDomainEntity(), $leadEmail->toDomainEntity());
        }
        if ($leadEmail->isDirty('clicked_at') && $leadEmail->clicked_at !== null) {
            LeadEmailClicked::dispatch($leadEmail->lead->toDomainEntity(), $leadEmail->toDomainEntity(), $leadEmail->tracked_url); // Supondo tracked_url
        }
    }

    /**
     * Handle the LeadEmailModel "deleted" event.
     *
     * @param LeadEmailModel $leadEmail
     */
    public function deleted(LeadEmailModel $leadEmail)
    {
        //
    }

    /**
     * Handle the LeadEmailModel "restored" event.
     *
     * @param LeadEmailModel $leadEmail
     */
    public function restored(LeadEmailModel $leadEmail)
    {
        //
    }

    /**
     * Handle the LeadEmailModel "forceDeleted" event.
     *
     * @param LeadEmailModel $leadEmail
     */
    public function forceDeleted(LeadEmailModel $leadEmail)
    {
        //
    }
}
