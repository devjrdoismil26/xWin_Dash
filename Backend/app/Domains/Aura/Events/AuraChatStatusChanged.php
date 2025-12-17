<?php

namespace App\Domains\Aura\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuraChatStatusChanged
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @param array<string, mixed> $context
     */
    public function __construct(
        public readonly string $chatId,
        public readonly string $oldStatus,
        public readonly string $newStatus,
        public readonly array $context = []
    ) {
    }
}
