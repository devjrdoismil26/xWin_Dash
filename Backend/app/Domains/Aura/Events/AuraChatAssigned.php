<?php

namespace App\Domains\Aura\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuraChatAssigned
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @param array<string, mixed> $context
     */
    public function __construct(
        public readonly string $chatId,
        public readonly string $assignedToUserId,
        public readonly ?string $previousAssignedUserId = null,
        public readonly array $context = []
    ) {
    }
}
