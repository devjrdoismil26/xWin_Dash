<?php

namespace App\Domains\Aura\Observers;

use App\Domains\Aura\Events\AuraFlowNodeCreated;
use App\Domains\Aura\Events\AuraFlowNodeDeleted;
use App\Domains\Aura\Events\AuraFlowNodeUpdated;
use App\Domains\Aura\Models\AuraFlowNode;

class AuraFlowNodeObserver
{
    /**
     * Handle the AuraFlowNode "created" event.
     */
    public function created(AuraFlowNode $auraFlowNode): void
    {
        event(new AuraFlowNodeCreated($auraFlowNode));
    }

    /**
     * Handle the AuraFlowNode "updated" event.
     */
    public function updated(AuraFlowNode $auraFlowNode): void
    {
        event(new AuraFlowNodeUpdated($auraFlowNode));
    }

    /**
     * Handle the AuraFlowNode "deleted" event.
     */
    public function deleted(AuraFlowNode $auraFlowNode): void
    {
        event(new AuraFlowNodeDeleted($auraFlowNode));
    }
}
