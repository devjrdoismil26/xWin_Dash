<?php

namespace App\Domains\AI\Application\Commands;

class ProcessChatMessageCommand
{
    public function __construct(
        public readonly int $chatbotId,
        public readonly string $message,
        public readonly ?string $sessionId = null,
        public readonly ?array $context = null,
        public readonly ?string $userId = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'chatbot_id' => $this->chatbotId,
            'message' => $this->message,
            'session_id' => $this->sessionId,
            'context' => $this->context,
            'user_id' => $this->userId
        ];
    }
}
