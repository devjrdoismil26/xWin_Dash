<?php

namespace App\Domains\Workflows\Application\Queries;

class GetWorkflowNodeQuery
{
    public function __construct(
        public readonly int $nodeId,
        public readonly int $workflowId,
        public readonly int $userId,
        public readonly bool $includeConfiguration = false,
        public readonly bool $includeExecutions = false,
        public readonly bool $includeAnalytics = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            nodeId: $data['node_id'],
            workflowId: $data['workflow_id'],
            userId: $data['user_id'],
            includeConfiguration: $data['include_configuration'] ?? false,
            includeExecutions: $data['include_executions'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'node_id' => $this->nodeId,
            'workflow_id' => $this->workflowId,
            'user_id' => $this->userId,
            'include_configuration' => $this->includeConfiguration,
            'include_executions' => $this->includeExecutions,
            'include_analytics' => $this->includeAnalytics
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
