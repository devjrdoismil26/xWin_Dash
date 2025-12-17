<?php

namespace App\Domains\Aura\Application\Commands;

class DeleteAuraChatCommand
{
    public function __construct(
        public readonly int $chatId,
        public readonly bool $forceDelete = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'chat_id' => $this->chatId,
            'force_delete' => $this->forceDelete
        ];
    }
}
