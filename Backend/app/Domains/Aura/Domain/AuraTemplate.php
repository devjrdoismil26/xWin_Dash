<?php

namespace App\Domains\Aura\Domain;

class AuraTemplate
{
    /**
     * @param array<string, mixed> $content
     * @param array<string, mixed> $variables
     */
    public function __construct(
        public readonly string $id,
        public readonly string $connectionId,
        public readonly string $name,
        public readonly string $type,
        public readonly array $content = [],
        public readonly array $variables = [],
        public readonly string $status = 'draft',
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
            type: $data['type'],
            content: $data['content'] ?? [],
            variables: $data['variables'] ?? [],
            status: $data['status'] ?? 'draft',
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
            'type' => $this->type,
            'content' => $this->content,
            'variables' => $this->variables,
            'status' => $this->status,
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }
}
