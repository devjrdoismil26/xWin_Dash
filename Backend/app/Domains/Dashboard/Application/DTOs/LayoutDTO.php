<?php

namespace App\Domains\Dashboard\Application\DTOs;

class LayoutDTO
{
    public function __construct(
        public readonly string $userId,
        public readonly array $layout,
        public readonly array $widgets,
        public readonly ?string $id = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'id' => $this->id,
            'user_id' => $this->userId,
            'layout' => $this->layout,
            'widgets' => $this->widgets,
        ], fn ($value) => $value !== null);
    }

    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            layout: $data['layout'] ?? [],
            widgets: $data['widgets'] ?? [],
            id: $data['id'] ?? null
        );
    }
}
