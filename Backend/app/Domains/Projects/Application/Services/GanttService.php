<?php

namespace App\Domains\Projects\Application\Services;

use App\Domains\Projects\Application\DTOs\GanttDataDTO;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\TaskDependencyModel as TaskDependency;
use Illuminate\Support\Collection;

class GanttService
{
    public function generateGanttData(string $projectId): GanttDataDTO
    {
        $tasks = $this->getProjectTasks($projectId);
        $dependencies = $this->getTaskDependencies($projectId);
        $criticalPath = $this->calculateCriticalPath($tasks, $dependencies);

        return new GanttDataDTO(
            projectId: $projectId,
            tasks: $tasks->toArray(),
            dependencies: $dependencies->toArray(),
            criticalPath: $criticalPath
        );
    }

    private function getProjectTasks(string $projectId): Collection
    {
        return collect([]);
    }

    private function getTaskDependencies(string $projectId): Collection
    {
        return TaskDependency::whereHas('task', function ($query) use ($projectId) {
            $query->where('project_id', $projectId);
        })->get();
    }

    private function calculateCriticalPath(Collection $tasks, Collection $dependencies): array
    {
        // Implementar algoritmo de Critical Path Method (CPM)
        return [];
    }
}
