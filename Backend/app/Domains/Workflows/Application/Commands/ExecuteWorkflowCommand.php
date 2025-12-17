<?php

namespace App\Domains\Workflows\Application\Commands;

class ExecuteWorkflowCommand
{
    public function __construct(
        public readonly int $workflowId,
        public readonly int $userId,
        public readonly ?array $initialPayload = null,
        public readonly ?string $executionMode = 'async',
        public readonly ?int $priority = 0,
        public readonly ?array $context = null,
        public readonly ?string $triggeredBy = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            workflowId: $data['workflow_id'],
            userId: $data['user_id'],
            initialPayload: $data['initial_payload'] ?? null,
            executionMode: $data['execution_mode'] ?? 'async',
            priority: $data['priority'] ?? 0,
            context: $data['context'] ?? null,
            triggeredBy: $data['triggered_by'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'workflow_id' => $this->workflowId,
            'user_id' => $this->userId,
            'initial_payload' => $this->initialPayload,
            'execution_mode' => $this->executionMode,
            'priority' => $this->priority,
            'context' => $this->context,
            'triggered_by' => $this->triggeredBy
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

        if (!in_array($this->executionMode, ['sync', 'async'])) {
            $errors[] = 'Modo de execução deve ser sync ou async';
        }

        return $errors;
    }
}
