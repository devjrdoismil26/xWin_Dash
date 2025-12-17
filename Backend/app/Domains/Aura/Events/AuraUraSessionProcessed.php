<?php

namespace App\Domains\Aura\Events;

use App\Domains\Aura\Models\AuraUraSession;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuraUraSessionProcessed
{
    use Dispatchable;
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public readonly AuraUraSession $session)
    {
    }
}
