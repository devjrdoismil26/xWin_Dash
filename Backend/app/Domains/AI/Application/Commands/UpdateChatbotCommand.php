<?php

namespace App\Domains\AI\Application\Commands;

class UpdateChatbotCommand
{
    public function __construct(
        public readonly int $chatbotId,
        public readonly ?string $name = null,
        public readonly ?string $description = null,
        public readonly ?string $personality = null,
        public readonly ?array $knowledgeBase = null,
        public readonly ?array $settings = null,
        public readonly ?bool $isActive = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'chatbot_id' => $this->chatbotId,
            'name' => $this->name,
            'description' => $this->description,
            'personality' => $this->personality,
            'knowledge_base' => $this->knowledgeBase,
            'settings' => $this->settings,
            'is_active' => $this->isActive
        ], function ($value) {
            return $value !== null;
        });
    }
}
