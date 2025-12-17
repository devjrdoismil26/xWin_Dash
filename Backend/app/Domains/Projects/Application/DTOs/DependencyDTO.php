<?php

namespace App\Domains\Projects\Application\DTOs;

class DependencyDTO
{
    public function __construct(
        public readonly string $taskId,
        public readonly string $dependsOnTaskId,
        public readonly string $type = 'finish_to_start',
        public readonly int $lagDays = 0,
        public readonly ?string $id = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'id' => $this->id,
            'task_id' => $this->taskId,
            'depends_on_task_id' => $this->dependsOnTaskId,
            'type' => $this->type,
            'lag_days' => $this->lagDays,
        ], fn ($value) => $value !== null);
    }

    public static function fromArray(array $data): self
    {
        return new self(
            taskId: $data['task_id'],
            dependsOnTaskId: $data['depends_on_task_id'],
            type: $data['type'] ?? 'finish_to_start',
            lagDays: $data['lag_days'] ?? 0,
            id: $data['id'] ?? null
        );
    }
}
