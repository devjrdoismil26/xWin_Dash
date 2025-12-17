<?php

namespace App\Domains\Aura\Observers;

use App\Domains\Aura\Events\AuraTemplateCreated;
use App\Domains\Aura\Events\AuraTemplateDeleted;
use App\Domains\Aura\Events\AuraTemplateUpdated;
use App\Domains\Aura\Models\AuraTemplate;

class AuraTemplateObserver
{
    /**
     * Handle the AuraTemplate "created" event.
     */
    public function created(AuraTemplate $auraTemplate): void
    {
        event(new AuraTemplateCreated($auraTemplate));
    }

    /**
     * Handle the AuraTemplate "updated" event.
     */
    public function updated(AuraTemplate $auraTemplate): void
    {
        event(new AuraTemplateUpdated($auraTemplate));
    }

    /**
     * Handle the AuraTemplate "deleted" event.
     */
    public function deleted(AuraTemplate $auraTemplate): void
    {
        event(new AuraTemplateDeleted($auraTemplate));
    }
}
