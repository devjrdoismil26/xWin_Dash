<?php

namespace App\Domains\Workflows\Application\Queries;

class ListWorkflowNodesQuery
{
    public function __construct(
        public readonly int $workflowId,
        public readonly int $userId,
        public readonly ?string $type = null,
        public readonly ?string $status = null,
        public readonly ?string $search = null,
        public readonly int $page = 1,
        public readonly int $perPage = 20,
        public readonly string $sortBy = 'created_at',
        public readonly string $sortDirection = 'desc',
        public readonly bool $includeConfiguration = false,
        public readonly bool $includeExecutions = false,
        public readonly bool $includeAnalytics = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            workflowId: $data['workflow_id'],
            userId: $data['user_id'],
            type: $data['type'] ?? null,
            status: $data['status'] ?? null,
            search: $data['search'] ?? null,
            page: $data['page'] ?? 1,
            perPage: $data['per_page'] ?? 20,
            sortBy: $data['sort_by'] ?? 'created_at',
            sortDirection: $data['sort_direction'] ?? 'desc',
            includeConfiguration: $data['include_configuration'] ?? false,
            includeExecutions: $data['include_executions'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'workflow_id' => $this->workflowId,
            'user_id' => $this->userId,
            'type' => $this->type,
            'status' => $this->status,
            'search' => $this->search,
            'page' => $this->page,
            'per_page' => $this->perPage,
            'sort_by' => $this->sortBy,
            'sort_direction' => $this->sortDirection,
            'include_configuration' => $this->includeConfiguration,
            'include_executions' => $this->includeExecutions,
            'include_analytics' => $this->includeAnalytics
        ];
    }

    public function isValid(): bool
    {
        return $this->workflowId > 0 && $this->userId > 0 && $this->page > 0 && $this->perPage > 0;
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

        if ($this->page <= 0) {
            $errors[] = 'Página deve ser maior que zero';
        }

        if ($this->perPage <= 0) {
            $errors[] = 'Itens por página deve ser maior que zero';
        }

        if ($this->perPage > 100) {
            $errors[] = 'Máximo de 100 itens por página';
        }

        if (!in_array($this->sortDirection, ['asc', 'desc'])) {
            $errors[] = 'Direção de ordenação deve ser asc ou desc';
        }

        return $errors;
    }
}
