<?php

namespace App\Domains\Aura\Observers;

use App\Domains\Aura\Events\AuraMessageCreated;
use App\Domains\Aura\Events\AuraMessageDeleted;
use App\Domains\Aura\Events\AuraMessageUpdated;
use App\Domains\Aura\Models\AuraMessage;

class AuraMessageObserver
{
    /**
     * Handle the AuraMessage "created" event.
     */
    public function created(AuraMessage $auraMessage): void
    {
        event(new AuraMessageCreated($auraMessage));
    }

    /**
     * Handle the AuraMessage "updated" event.
     */
    public function updated(AuraMessage $auraMessage): void
    {
        event(new AuraMessageUpdated($auraMessage));
    }

    /**
     * Handle the AuraMessage "deleted" event.
     */
    public function deleted(AuraMessage $auraMessage): void
    {
        event(new AuraMessageDeleted($auraMessage));
    }
}
