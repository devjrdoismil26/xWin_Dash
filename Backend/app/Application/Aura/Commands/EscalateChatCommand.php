<?php

namespace App\Application\Aura\Commands;

class EscalateChatCommand
{
    public string $chatId;

    public function __construct(string $chatId)
    {
        $this->chatId = $chatId;
    }
}