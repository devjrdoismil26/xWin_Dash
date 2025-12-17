<?php

namespace App\Domains\Aura\Events;

use App\Domains\Aura\Models\AuraConnection;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuraConnectionDisconnected
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public readonly AuraConnection $connection)
    {
    }
}
