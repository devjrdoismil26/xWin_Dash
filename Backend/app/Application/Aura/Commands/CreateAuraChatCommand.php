<?php

namespace App\Application\Aura\Commands;

class CreateAuraChatCommand
{
    public int $userId;

    public string $chatType;

    public ?string $initialMessage;

    public function __construct(int $userId, string $chatType, ?string $initialMessage = null)
    {
        $this->userId = $userId;
        $this->chatType = $chatType;
        $this->initialMessage = $initialMessage;
    }
}
