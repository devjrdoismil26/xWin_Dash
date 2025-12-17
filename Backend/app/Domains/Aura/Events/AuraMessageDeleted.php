<?php

namespace App\Domains\Aura\Events;

use App\Domains\Aura\Models\AuraMessage;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuraMessageDeleted
{
    use Dispatchable;
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public readonly AuraMessage $message)
    {
    }
}
