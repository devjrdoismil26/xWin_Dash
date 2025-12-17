<?php

namespace App\Domains\Aura\Observers;

use App\Domains\Aura\Events\AuraFlowCreated;
use App\Domains\Aura\Events\AuraFlowDeleted;
use App\Domains\Aura\Events\AuraFlowStatusChanged;
use App\Domains\Aura\Events\AuraFlowUpdated;
use App\Domains\Aura\Models\AuraFlow;

class AuraFlowObserver
{
    /**
     * Handle the AuraFlow "created" event.
     */
    public function created(AuraFlow $auraFlow): void
    {
        event(new AuraFlowCreated($auraFlow));
    }

    /**
     * Handle the AuraFlow "updated" event.
     */
    public function updated(AuraFlow $auraFlow): void
    {
        if ($auraFlow->isDirty('status')) {
            event(new AuraFlowStatusChanged($auraFlow, $auraFlow->getOriginal('status'), $auraFlow->status));
        }
        event(new AuraFlowUpdated($auraFlow));
    }

    /**
     * Handle the AuraFlow "deleted" event.
     */
    public function deleted(AuraFlow $auraFlow): void
    {
        event(new AuraFlowDeleted($auraFlow));
    }
}
