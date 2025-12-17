<?php

namespace App\Domains\Universe\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AIPersonalizationCompleted
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public string $instanceId,
        public array $personalizations
    ) {}
}
