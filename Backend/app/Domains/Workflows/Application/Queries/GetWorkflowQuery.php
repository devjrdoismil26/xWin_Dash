<?php

namespace App\Domains\Workflows\Application\Queries;

class GetWorkflowQuery
{
    public function __construct(
        public readonly int $workflowId,
        public readonly int $userId,
        public readonly bool $includeNodes = false,
        public readonly bool $includeExecutions = false,
        public readonly bool $includeAnalytics = false,
        public readonly bool $includeConfiguration = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            workflowId: $data['workflow_id'],
            userId: $data['user_id'],
            includeNodes: $data['include_nodes'] ?? false,
            includeExecutions: $data['include_executions'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false,
            includeConfiguration: $data['include_configuration'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'workflow_id' => $this->workflowId,
            'user_id' => $this->userId,
            'include_nodes' => $this->includeNodes,
            'include_executions' => $this->includeExecutions,
            'include_analytics' => $this->includeAnalytics,
            'include_configuration' => $this->includeConfiguration
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

        return $errors;
    }
}
