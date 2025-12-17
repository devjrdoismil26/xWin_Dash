<?php

namespace App\Domains\Dashboard\Application\DTOs;

class WidgetDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $type,
        public readonly array $config,
        public readonly ?int $order = 0,
        public readonly ?bool $isActive = true,
        public readonly ?string $id = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'config' => $this->config,
            'order' => $this->order,
            'is_active' => $this->isActive,
        ], fn ($value) => $value !== null);
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            type: $data['type'],
            config: $data['config'] ?? [],
            order: $data['order'] ?? 0,
            isActive: $data['is_active'] ?? true,
            id: $data['id'] ?? null
        );
    }
}
