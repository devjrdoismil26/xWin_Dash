<?php

namespace App\Domains\Workflows\Application\Commands;

class UpdateWorkflowCommand
{
    public function __construct(
        public readonly int $workflowId,
        public readonly int $userId,
        public readonly ?string $name = null,
        public readonly ?string $description = null,
        public readonly ?string $type = null,
        public readonly ?array $configuration = null,
        public readonly ?array $nodes = null,
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
            workflowId: $data['workflow_id'],
            userId: $data['user_id'],
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            type: $data['type'] ?? null,
            configuration: $data['configuration'] ?? null,
            nodes: $data['nodes'] ?? null,
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
            'workflow_id' => $this->workflowId,
            'user_id' => $this->userId,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'configuration' => $this->configuration,
            'nodes' => $this->nodes,
            'connections' => $this->connections,
            'status' => $this->status,
            'is_active' => $this->isActive,
            'tags' => $this->tags,
            'metadata' => $this->metadata
        ];
    }

    public function isValid(): bool
    {
        return $this->workflowId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->workflowId <= 0) {
            $errors[] = 'ID do workflow é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if ($this->name && strlen($this->name) > 255) {
            $errors[] = 'Nome do workflow não pode ter mais de 255 caracteres';
        }

        if ($this->description && strlen($this->description) > 1000) {
            $errors[] = 'Descrição não pode ter mais de 1000 caracteres';
        }

        return $errors;
    }
}
