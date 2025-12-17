<?php

namespace App\Domains\Aura\Application\Queries;

class GetAuraChatQuery
{
    public function __construct(
        public readonly int $chatId,
        public readonly bool $includeMessages = false,
        public readonly bool $includeContext = false,
        public readonly ?int $messageLimit = 50
    ) {
    }

    public function toArray(): array
    {
        return [
            'chat_id' => $this->chatId,
            'include_messages' => $this->includeMessages,
            'include_context' => $this->includeContext,
            'message_limit' => $this->messageLimit
        ];
    }
}
