<?php

namespace App\Domains\Aura\Domain;

class AuraConnection
{
    /**
     * @param array<string, mixed> $config
     */
    public function __construct(
        public readonly string $id,
        public readonly string $userId,
        public readonly string $projectId,
        public readonly string $name,
        public readonly string $type,
        public readonly array $config = [],
        public readonly string $status = 'inactive',
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
            userId: $data['user_id'],
            projectId: $data['project_id'],
            name: $data['name'],
            type: $data['type'],
            config: $data['config'] ?? [],
            status: $data['status'] ?? 'inactive',
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
            'user_id' => $this->userId,
            'project_id' => $this->projectId,
            'name' => $this->name,
            'type' => $this->type,
            'config' => $this->config,
            'status' => $this->status,
            'is_active' => $this->isActive,
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }
}
