<?php

namespace App\Domains\AI\Application\Commands;

class DeleteChatbotCommand
{
    public function __construct(
        public readonly int $chatbotId,
        public readonly bool $forceDelete = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'chatbot_id' => $this->chatbotId,
            'force_delete' => $this->forceDelete
        ];
    }
}
