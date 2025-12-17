<?php

namespace App\Domains\Universe\Events;

use App\Domains\Universe\Models\UniverseInstance;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UniverseInstanceUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public UniverseInstance $instance,
        public array $changes = []
    ) {}
}
