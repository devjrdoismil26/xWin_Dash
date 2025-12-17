<?php

namespace App\Domains\Projects\Application\DTOs;

class GanttDataDTO
{
    public function __construct(
        public readonly string $projectId,
        public readonly array $tasks,
        public readonly array $dependencies,
        public readonly ?array $criticalPath = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'project_id' => $this->projectId,
            'tasks' => $this->tasks,
            'dependencies' => $this->dependencies,
            'critical_path' => $this->criticalPath,
        ];
    }
}
