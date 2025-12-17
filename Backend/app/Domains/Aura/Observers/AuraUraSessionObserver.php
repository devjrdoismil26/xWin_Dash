<?php

namespace App\Domains\Aura\Observers;

use App\Domains\Aura\Events\AuraUraSessionCreated;
use App\Domains\Aura\Events\AuraUraSessionDeleted;
use App\Domains\Aura\Events\AuraUraSessionUpdated;
use App\Domains\Aura\Models\AuraUraSession;

class AuraUraSessionObserver
{
    /**
     * Handle the AuraUraSession "created" event.
     */
    public function created(AuraUraSession $auraUraSession): void
    {
        event(new AuraUraSessionCreated($auraUraSession));
    }

    /**
     * Handle the AuraUraSession "updated" event.
     */
    public function updated(AuraUraSession $auraUraSession): void
    {
        event(new AuraUraSessionUpdated($auraUraSession));
    }

    /**
     * Handle the AuraUraSession "deleted" event.
     */
    public function deleted(AuraUraSession $auraUraSession): void
    {
        event(new AuraUraSessionDeleted($auraUraSession));
    }
}
