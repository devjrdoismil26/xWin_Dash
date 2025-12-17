<?php

namespace App\Domains\Aura\Domain;

class AuraFlowNode
{
    /**
     * @param array<string, mixed> $config
     * @param array<string, mixed> $position
     */
    public function __construct(
        public readonly string $id,
        public readonly string $flowId,
        public readonly string $type,
        public readonly string $name,
        public readonly array $config = [],
        public readonly array $position = [],
        public readonly int $order = 0,
        public readonly ?\DateTime $createdAt = null,
        public readonly ?\DateTime $updatedAt = null,
    ) {
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'],
            flowId: $data['flow_id'],
            type: $data['type'],
            name: $data['name'],
            config: $data['config'] ?? [],
            position: $data['position'] ?? [],
            order: $data['order'] ?? 0,
            createdAt: isset($data['created_at']) ? new \DateTime($data['created_at']) : null,
            updatedAt: isset($data['updated_at']) ? new \DateTime($data['updated_at']) : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'flow_id' => $this->flowId,
            'type' => $this->type,
            'name' => $this->name,
            'config' => $this->config,
            'position' => $this->position,
            'order' => $this->order,
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }
}
