<?php

namespace App\Domains\Leads\Observers;

use App\Domains\Leads\Events\LeadCreated;
use App\Domains\Leads\Events\LeadDeleted;
use App\Domains\Leads\Events\LeadScoreUpdated;
use App\Domains\Leads\Events\LeadStatusChanged;
use App\Domains\Leads\Events\LeadTagsUpdated;
use App\Domains\Leads\Events\LeadUpdated;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadModel;

class LeadObserver
{
    /**
     * Handle the LeadModel "created" event.
     *
     * @param LeadModel $lead
     */
    public function created(LeadModel $lead)
    {
        // Temporariamente desabilitado para desenvolvimento
        // LeadCreated::dispatch($lead->toDomainEntity());
    }

    /**
     * Handle the LeadModel "updated" event.
     *
     * @param LeadModel $lead
     */
    public function updated(LeadModel $lead)
    {
        // Temporariamente desabilitado para desenvolvimento
        // LeadUpdated::dispatch($lead->toDomainEntity());

        // if ($lead->isDirty('status')) {
        //     LeadStatusChanged::dispatch($lead->toDomainEntity(), $lead->status);
        // }

        // if ($lead->isDirty('score')) {
        //     LeadScoreUpdated::dispatch($lead->toDomainEntity(), $lead->score);
        // }

        // if ($lead->isDirty('tags')) {
        //     LeadTagsUpdated::dispatch($lead->toDomainEntity(), $lead->tags);
        // }
    }

    /**
     * Handle the LeadModel "deleted" event.
     *
     * @param LeadModel $lead
     */
    public function deleted(LeadModel $lead)
    {
        // Temporariamente desabilitado para desenvolvimento
        // LeadDeleted::dispatch($lead->toDomainEntity());
    }

    /**
     * Handle the LeadModel "restored" event.
     *
     * @param LeadModel $lead
     */
    public function restored(LeadModel $lead)
    {
        //
    }

    /**
     * Handle the LeadModel "forceDeleted" event.
     *
     * @param LeadModel $lead
     */
    public function forceDeleted(LeadModel $lead)
    {
        //
    }
}
