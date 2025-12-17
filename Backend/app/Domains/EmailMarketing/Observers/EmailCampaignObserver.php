<?php

namespace App\Domains\EmailMarketing\Observers;

use App\Domains\EmailMarketing\Events\EmailCampaignCreated;
use App\Domains\EmailMarketing\Events\EmailCampaignDeleted;
use App\Domains\EmailMarketing\Events\EmailCampaignStatusChanged;
use App\Domains\EmailMarketing\Events\EmailCampaignUpdated;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignModel;

class EmailCampaignObserver
{
    /**
     * Handle the EmailCampaignModel "created" event.
     *
     * @param EmailCampaignModel $emailCampaign
     */
    public function created(EmailCampaignModel $emailCampaign): void
    {
        EmailCampaignCreated::dispatch($emailCampaign); // Supondo um método toDomainEntity()
    }

    /**
     * Handle the EmailCampaignModel "updated" event.
     *
     * @param EmailCampaignModel $emailCampaign
     */
    public function updated(EmailCampaignModel $emailCampaign): void
    {
        EmailCampaignUpdated::dispatch($emailCampaign);

        // Disparar evento de mudança de status se o status foi alterado
        if ($emailCampaign->isDirty('status')) {
            EmailCampaignStatusChanged::dispatch($emailCampaign, $emailCampaign->status);
        }
    }

    /**
     * Handle the EmailCampaignModel "deleted" event.
     *
     * @param EmailCampaignModel $emailCampaign
     */
    public function deleted(EmailCampaignModel $emailCampaign): void
    {
        EmailCampaignDeleted::dispatch($emailCampaign);
    }

    /**
     * Handle the EmailCampaignModel "restored" event.
     *
     * @param EmailCampaignModel $emailCampaign
     */
    public function restored(EmailCampaignModel $emailCampaign): void
    {
        //
    }

    /**
     * Handle the EmailCampaignModel "forceDeleted" event.
     *
     * @param EmailCampaignModel $emailCampaign
     */
    public function forceDeleted(EmailCampaignModel $emailCampaign): void
    {
        //
    }
}
