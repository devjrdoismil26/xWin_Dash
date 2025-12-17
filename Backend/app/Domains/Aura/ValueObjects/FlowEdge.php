<?php

namespace App\Domains\Aura\ValueObjects;

class FlowEdge
{
    public function __construct(
        public readonly string $id,
        public readonly string $source,
        public readonly string $target,
        public readonly ?string $label = null,
        public readonly ?string $condition = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['id'],
            $data['source'],
            $data['target'],
            $data['label'] ?? null,
            $data['condition'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'source' => $this->source,
            'target' => $this->target,
            'label' => $this->label,
            'condition' => $this->condition,
        ];
    }
}
