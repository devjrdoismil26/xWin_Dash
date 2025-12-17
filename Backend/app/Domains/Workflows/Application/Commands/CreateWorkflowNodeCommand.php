<?php

namespace App\Domains\Workflows\Application\Commands;

class CreateWorkflowNodeCommand
{
    public function __construct(
        public readonly int $workflowId,
        public readonly int $userId,
        public readonly string $type,
        public readonly string $name,
        public readonly ?string $description = null,
        public readonly ?array $configuration = null,
        public readonly ?array $position = null,
        public readonly ?array $inputs = null,
        public readonly ?array $outputs = null,
        public readonly ?string $status = 'draft',
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            workflowId: $data['workflow_id'],
            userId: $data['user_id'],
            type: $data['type'],
            name: $data['name'],
            description: $data['description'] ?? null,
            configuration: $data['configuration'] ?? null,
            position: $data['position'] ?? null,
            inputs: $data['inputs'] ?? null,
            outputs: $data['outputs'] ?? null,
            status: $data['status'] ?? 'draft',
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'workflow_id' => $this->workflowId,
            'user_id' => $this->userId,
            'type' => $this->type,
            'name' => $this->name,
            'description' => $this->description,
            'configuration' => $this->configuration,
            'position' => $this->position,
            'inputs' => $this->inputs,
            'outputs' => $this->outputs,
            'status' => $this->status,
            'metadata' => $this->metadata
        ];
    }

    public function isValid(): bool
    {
        return $this->workflowId > 0 && $this->userId > 0 && !empty($this->type) && !empty($this->name);
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

        if (empty($this->type)) {
            $errors[] = 'Tipo do nó é obrigatório';
        }

        if (empty($this->name)) {
            $errors[] = 'Nome do nó é obrigatório';
        }

        if (strlen($this->name) > 255) {
            $errors[] = 'Nome do nó não pode ter mais de 255 caracteres';
        }

        if ($this->description && strlen($this->description) > 1000) {
            $errors[] = 'Descrição não pode ter mais de 1000 caracteres';
        }

        return $errors;
    }
}
