<?php

namespace App\Domains\Analytics\Application\DTOs;

class KPIConfigDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $metric,
        public readonly ?float $target = null,
        public readonly ?string $unit = null,
        public readonly ?array $thresholds = null,
        public readonly ?string $id = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'id' => $this->id,
            'name' => $this->name,
            'metric' => $this->metric,
            'target' => $this->target,
            'unit' => $this->unit,
            'thresholds' => $this->thresholds,
        ], fn ($value) => $value !== null);
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            metric: $data['metric'],
            target: $data['target'] ?? null,
            unit: $data['unit'] ?? null,
            thresholds: $data['thresholds'] ?? null,
            id: $data['id'] ?? null
        );
    }
}
