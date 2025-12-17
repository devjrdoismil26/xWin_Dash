<?php

namespace App\Domains\Universe\Application\Commands;

class UpdateUniverseInstanceCommand
{
    public function __construct(
        public readonly int $instanceId,
        public readonly int $userId,
        public readonly ?string $name = null,
        public readonly ?string $description = null,
        public readonly ?array $configuration = null,
        public readonly ?array $blocks = null,
        public readonly ?array $connections = null,
        public readonly ?string $status = null,
        public readonly ?bool $isActive = null,
        public readonly ?array $tags = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            instanceId: $data['instance_id'],
            userId: $data['user_id'],
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            configuration: $data['configuration'] ?? null,
            blocks: $data['blocks'] ?? null,
            connections: $data['connections'] ?? null,
            status: $data['status'] ?? null,
            isActive: $data['is_active'] ?? null,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'instance_id' => $this->instanceId,
            'user_id' => $this->userId,
            'name' => $this->name,
            'description' => $this->description,
            'configuration' => $this->configuration,
            'blocks' => $this->blocks,
            'connections' => $this->connections,
            'status' => $this->status,
            'is_active' => $this->isActive,
            'tags' => $this->tags,
            'metadata' => $this->metadata
        ];
    }

    public function isValid(): bool
    {
        return $this->instanceId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->instanceId <= 0) {
            $errors[] = 'ID da instância é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if ($this->name && strlen($this->name) > 255) {
            $errors[] = 'Nome da instância não pode ter mais de 255 caracteres';
        }

        if ($this->description && strlen($this->description) > 1000) {
            $errors[] = 'Descrição não pode ter mais de 1000 caracteres';
        }

        return $errors;
    }
}
