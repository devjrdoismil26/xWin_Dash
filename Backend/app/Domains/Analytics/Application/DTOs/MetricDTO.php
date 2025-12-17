<?php

namespace App\Domains\Analytics\Application\DTOs;

class MetricDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $type,
        public readonly mixed $value,
        public readonly ?array $metadata = null,
        public readonly ?string $period = null,
        public readonly ?string $id = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'value' => $this->value,
            'metadata' => $this->metadata,
            'period' => $this->period,
        ], fn ($value) => $value !== null);
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            type: $data['type'],
            value: $data['value'],
            metadata: $data['metadata'] ?? null,
            period: $data['period'] ?? null,
            id: $data['id'] ?? null
        );
    }
}
