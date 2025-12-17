<?php

namespace App\Domains\Aura\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuraFlowStatusChanged
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @param array<string, mixed> $context
     */
    public function __construct(
        public readonly string $flowId,
        public readonly string $oldStatus,
        public readonly string $newStatus,
        public readonly array $context = []
    ) {
    }
}
