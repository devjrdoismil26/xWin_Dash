<?php

namespace App\Domains\Aura\ValueObjects;

class FlowNode
{
    public function __construct(
        public readonly string $id,
        public readonly string $type,
        public readonly array $data,
        public readonly ?string $next = null,
        public readonly array $position = ['x' => 0, 'y' => 0]
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['id'],
            $data['type'],
            $data['data'] ?? [],
            $data['next'] ?? null,
            $data['position'] ?? ['x' => 0, 'y' => 0]
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'data' => $this->data,
            'next' => $this->next,
            'position' => $this->position,
        ];
    }
}
