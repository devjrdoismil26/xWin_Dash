<?php

namespace App\Domains\Dashboard\Application\DTOs;

class CustomizationDTO
{
    public function __construct(
        public readonly string $userId,
        public readonly array $preferences,
        public readonly array $visibleWidgets,
        public readonly ?string $id = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'id' => $this->id,
            'user_id' => $this->userId,
            'preferences' => $this->preferences,
            'visible_widgets' => $this->visibleWidgets,
        ], fn ($value) => $value !== null);
    }

    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            preferences: $data['preferences'] ?? [],
            visibleWidgets: $data['visible_widgets'] ?? [],
            id: $data['id'] ?? null
        );
    }
}
