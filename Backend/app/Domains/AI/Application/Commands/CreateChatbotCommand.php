<?php

namespace App\Domains\AI\Application\Commands;

class CreateChatbotCommand
{
    public function __construct(
        public readonly string $name,
        public readonly string $description,
        public readonly ?string $personality = null,
        public readonly ?array $knowledgeBase = null,
        public readonly ?array $settings = null,
        public readonly ?bool $isActive = true
    ) {
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'personality' => $this->personality,
            'knowledge_base' => $this->knowledgeBase,
            'settings' => $this->settings,
            'is_active' => $this->isActive
        ];
    }
}
