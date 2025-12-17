<?php

namespace App\Domains\Projects\Application\Commands;

class CreateTaskCommand
{
    public function __construct(
        public readonly int $projectId,
        public readonly int $userId,
        public readonly string $title,
        public readonly ?string $description = null,
        public readonly ?string $priority = 'medium',
        public readonly ?string $status = 'pending',
        public readonly ?int $assignedTo = null,
        public readonly ?string $dueDate = null,
        public readonly ?int $parentTaskId = null,
        public readonly ?array $dependencies = null,
        public readonly ?array $tags = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            projectId: $data['project_id'],
            userId: $data['user_id'],
            title: $data['title'],
            description: $data['description'] ?? null,
            priority: $data['priority'] ?? 'medium',
            status: $data['status'] ?? 'pending',
            assignedTo: $data['assigned_to'] ?? null,
            dueDate: $data['due_date'] ?? null,
            parentTaskId: $data['parent_task_id'] ?? null,
            dependencies: $data['dependencies'] ?? null,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'project_id' => $this->projectId,
            'user_id' => $this->userId,
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'status' => $this->status,
            'assigned_to' => $this->assignedTo,
            'due_date' => $this->dueDate,
            'parent_task_id' => $this->parentTaskId,
            'dependencies' => $this->dependencies,
            'tags' => $this->tags,
            'metadata' => $this->metadata
        ];
    }

    public function isValid(): bool
    {
        return !empty($this->title) && $this->projectId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if (empty($this->title)) {
            $errors[] = 'Título da tarefa é obrigatório';
        }

        if ($this->projectId <= 0) {
            $errors[] = 'ID do projeto é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (strlen($this->title) > 255) {
            $errors[] = 'Título não pode ter mais de 255 caracteres';
        }

        if ($this->description && strlen($this->description) > 1000) {
            $errors[] = 'Descrição não pode ter mais de 1000 caracteres';
        }

        if (!in_array($this->priority, ['low', 'medium', 'high', 'critical'])) {
            $errors[] = 'Prioridade deve ser low, medium, high ou critical';
        }

        if (!in_array($this->status, ['pending', 'in_progress', 'completed', 'cancelled'])) {
            $errors[] = 'Status deve ser pending, in_progress, completed ou cancelled';
        }

        return $errors;
    }
}
