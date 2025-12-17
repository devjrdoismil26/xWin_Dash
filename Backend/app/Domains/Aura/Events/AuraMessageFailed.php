<?php

namespace App\Domains\Aura\Events;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraMessageModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuraMessageFailed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public AuraMessageModel $message,
        public string $error
    ) {}
}
