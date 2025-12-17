<?php

namespace App\Application\Aura\Commands;

class UpdateAuraChatStatusCommand
{
    public int $chatId;

    public string $newStatus;

    public function __construct(int $chatId, string $newStatus)
    {
        $this->chatId = $chatId;
        $this->newStatus = $newStatus;
    }
}
