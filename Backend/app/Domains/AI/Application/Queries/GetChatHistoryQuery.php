<?php

namespace App\Domains\AI\Application\Queries;

class GetChatHistoryQuery
{
    public function __construct(
        public readonly int $chatbotId,
        public readonly ?string $sessionId = null,
        public readonly ?string $userId = null,
        public readonly ?int $page = 1,
        public readonly ?int $perPage = 20
    ) {
    }

    public function toArray(): array
    {
        return [
            'chatbot_id' => $this->chatbotId,
            'session_id' => $this->sessionId,
            'user_id' => $this->userId,
            'page' => $this->page,
            'per_page' => $this->perPage
        ];
    }
}
