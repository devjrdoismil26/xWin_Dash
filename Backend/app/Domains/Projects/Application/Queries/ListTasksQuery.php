<?php

namespace App\Domains\Projects\Application\Queries;

class ListTasksQuery
{
    public function __construct(
        public readonly int $projectId,
        public readonly int $userId,
        public readonly ?string $status = null,
        public readonly ?string $priority = null,
        public readonly ?int $assignedTo = null,
        public readonly ?string $search = null,
        public readonly ?array $tags = null,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly int $page = 1,
        public readonly int $perPage = 20,
        public readonly string $sortBy = 'created_at',
        public readonly string $sortDirection = 'desc',
        public readonly bool $includeDependencies = false,
        public readonly bool $includeSubtasks = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            projectId: $data['project_id'],
            userId: $data['user_id'],
            status: $data['status'] ?? null,
            priority: $data['priority'] ?? null,
            assignedTo: $data['assigned_to'] ?? null,
            search: $data['search'] ?? null,
            tags: $data['tags'] ?? null,
            dateFrom: $data['date_from'] ?? null,
            dateTo: $data['date_to'] ?? null,
            page: $data['page'] ?? 1,
            perPage: $data['per_page'] ?? 20,
            sortBy: $data['sort_by'] ?? 'created_at',
            sortDirection: $data['sort_direction'] ?? 'desc',
            includeDependencies: $data['include_dependencies'] ?? false,
            includeSubtasks: $data['include_subtasks'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'project_id' => $this->projectId,
            'user_id' => $this->userId,
            'status' => $this->status,
            'priority' => $this->priority,
            'assigned_to' => $this->assignedTo,
            'search' => $this->search,
            'tags' => $this->tags,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'page' => $this->page,
            'per_page' => $this->perPage,
            'sort_by' => $this->sortBy,
            'sort_direction' => $this->sortDirection,
            'include_dependencies' => $this->includeDependencies,
            'include_subtasks' => $this->includeSubtasks
        ];
    }

    public function isValid(): bool
    {
        return $this->projectId > 0 && $this->userId > 0 && $this->page > 0 && $this->perPage > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->projectId <= 0) {
            $errors[] = 'ID do projeto é obrigatório';
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
