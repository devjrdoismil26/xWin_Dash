<?php

namespace App\Domains\Aura\Application\Commands;

class UpdateAuraChatCommand
{
    public function __construct(
        public readonly int $chatId,
        public readonly ?string $title = null,
        public readonly ?string $description = null,
        public readonly ?string $personality = null,
        public readonly ?array $context = null,
        public readonly ?array $settings = null,
        public readonly ?bool $isActive = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'chat_id' => $this->chatId,
            'title' => $this->title,
            'description' => $this->description,
            'personality' => $this->personality,
            'context' => $this->context,
            'settings' => $this->settings,
            'is_active' => $this->isActive
        ], function ($value) {
            return $value !== null;
        });
    }
}
