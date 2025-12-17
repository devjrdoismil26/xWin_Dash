<?php

namespace App\Domains\Aura\Domain;

class AuraFlow
{
    /**
     * @param array<string, mixed> $structure
     */
    public function __construct(
        public readonly string $id,
        public readonly string $connectionId,
        public readonly string $name,
        public readonly ?string $description,
        public readonly array $structure = [],
        public readonly string $status = 'draft',
        public readonly bool $isActive = false,
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
            connectionId: $data['connection_connectionId'],
            name: $data['name'],
            description: $data['description'] ?? null,
            structure: $data['structure'] ?? [],
            status: $data['status'] ?? 'draft',
            isActive: $data['is_active'] ?? false,
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
            'connection_id' => $this->connectionId,
            'name' => $this->name,
            'description' => $this->description,
            'structure' => $this->structure,
            'status' => $this->status,
            'is_active' => $this->isActive,
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }
}
