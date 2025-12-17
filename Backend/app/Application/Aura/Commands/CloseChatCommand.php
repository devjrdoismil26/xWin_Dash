<?php

namespace App\Application\Aura\Commands;

class CloseChatCommand
{
    public string $chatId;
    public ?string $reason;

    public function __construct(string $chatId, ?string $reason = null)
    {
        $this->chatId = $chatId;
        $this->reason = $reason;
    }
}