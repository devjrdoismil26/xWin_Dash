<?php

namespace App\Domains\Workflows\Application\Commands;

class DeleteWorkflowNodeCommand
{
    public function __construct(
        public readonly int $nodeId,
        public readonly int $workflowId,
        public readonly int $userId,
        public readonly ?string $reason = null,
        public readonly bool $forceDelete = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            nodeId: $data['node_id'],
            workflowId: $data['workflow_id'],
            userId: $data['user_id'],
            reason: $data['reason'] ?? null,
            forceDelete: $data['force_delete'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'node_id' => $this->nodeId,
            'workflow_id' => $this->workflowId,
            'user_id' => $this->userId,
            'reason' => $this->reason,
            'force_delete' => $this->forceDelete
        ];
    }

    public function isValid(): bool
    {
        return $this->nodeId > 0 && $this->workflowId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->nodeId <= 0) {
            $errors[] = 'ID do nó é obrigatório';
        }

        if ($this->workflowId <= 0) {
            $errors[] = 'ID do workflow é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }
}
