<?php

namespace App\Domains\Analytics\Application\DTOs;

class ReportDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $type,
        public readonly array $config,
        public readonly array $filters,
        public readonly ?string $userId = null,
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
            'filters' => $this->filters,
            'user_id' => $this->userId,
        ], fn ($value) => $value !== null);
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            type: $data['type'],
            config: $data['config'] ?? [],
            filters: $data['filters'] ?? [],
            userId: $data['user_id'] ?? null,
            id: $data['id'] ?? null
        );
    }
}
