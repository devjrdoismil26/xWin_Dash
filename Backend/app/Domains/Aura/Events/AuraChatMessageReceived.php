<?php

namespace App\Domains\Aura\Events;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuraChatMessageReceived
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public AuraChatModel $chat,
        public array $message
    ) {}
}
