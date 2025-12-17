<?php

namespace App\Domains\Aura\Events;

use App\Domains\Aura\Models\AuraFlow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuraFlowCreated
{
    use Dispatchable;
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public readonly AuraFlow $flow)
    {
    }
}
