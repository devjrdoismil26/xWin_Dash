<?php

namespace App\Domains\Aura\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuraFlowStarted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $flowId,
        public string $executionId,
        public string $phoneNumber
    ) {}
}
