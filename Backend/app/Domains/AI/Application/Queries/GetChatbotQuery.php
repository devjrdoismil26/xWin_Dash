<?php

namespace App\Domains\AI\Application\Queries;

class GetChatbotQuery
{
    public function __construct(
        public readonly int $chatbotId,
        public readonly bool $includeStats = false,
        public readonly bool $includeConversations = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'chatbot_id' => $this->chatbotId,
            'include_stats' => $this->includeStats,
            'include_conversations' => $this->includeConversations
        ];
    }
}
