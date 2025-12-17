<?php

namespace App\Domains\Aura\Application\Commands;

class CreateAuraChatCommand
{
    public function __construct(
        public readonly string $title,
        public readonly ?string $description = null,
        public readonly ?string $personality = null,
        public readonly ?array $context = null,
        public readonly ?array $settings = null,
        public readonly ?bool $isActive = true
    ) {
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'personality' => $this->personality,
            'context' => $this->context,
            'settings' => $this->settings,
            'is_active' => $this->isActive
        ];
    }
}
