<?php

namespace App\Domains\Projects\Application\Queries;

class GetTaskQuery
{
    public function __construct(
        public readonly int $taskId,
        public readonly int $projectId,
        public readonly int $userId,
        public readonly bool $includeDependencies = false,
        public readonly bool $includeSubtasks = false,
        public readonly bool $includeAnalytics = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            taskId: $data['task_id'],
            projectId: $data['project_id'],
            userId: $data['user_id'],
            includeDependencies: $data['include_dependencies'] ?? false,
            includeSubtasks: $data['include_subtasks'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'task_id' => $this->taskId,
            'project_id' => $this->projectId,
            'user_id' => $this->userId,
            'include_dependencies' => $this->includeDependencies,
            'include_subtasks' => $this->includeSubtasks,
            'include_analytics' => $this->includeAnalytics
        ];
    }

    public function isValid(): bool
    {
        return $this->taskId > 0 && $this->projectId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->taskId <= 0) {
            $errors[] = 'ID da tarefa é obrigatório';
        }

        if ($this->projectId <= 0) {
            $errors[] = 'ID do projeto é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }
}
