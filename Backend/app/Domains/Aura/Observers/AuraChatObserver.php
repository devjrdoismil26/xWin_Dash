<?php

namespace App\Domains\Aura\Observers;

use App\Domains\Aura\Events\AuraChatAssigned;
use App\Domains\Aura\Events\AuraChatCreated;
use App\Domains\Aura\Events\AuraChatDeleted;
use App\Domains\Aura\Events\AuraChatStatusChanged;
use App\Domains\Aura\Models\AuraChat;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;

class AuraChatObserver
{
    /**
     * Handle the AuraChat "created" event.
     */
    public function created(AuraChat $auraChat): void
    {
        event(new AuraChatCreated($auraChat));
    }

    /**
     * Handle the AuraChat "updated" event.
     */
    public function updated(AuraChat $auraChat): void
    {
        if ($auraChat->isDirty('status')) {
            event(new AuraChatStatusChanged($auraChat, $auraChat->getOriginal('status'), $auraChat->status));
        }

        if ($auraChat->isDirty('assigned_to_user_id') && $auraChat->assignedUser) {
            event(new AuraChatAssigned($auraChat, $auraChat->assignedUser));
        }
    }

    /**
     * Handle the AuraChat "deleted" event.
     */
    public function deleted(AuraChat $auraChat): void
    {
        event(new AuraChatDeleted($auraChat));
    }
}
