<?php

namespace App\Domains\Projects\Application\Services;

use App\Domains\Projects\Application\DTOs\DependencyDTO;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\TaskDependencyModel as TaskDependency;
use Illuminate\Support\Collection;

class DependencyService
{
    public function getDependenciesByProject(string $projectId): Collection
    {
        return TaskDependency::whereHas('task', function ($query) use ($projectId) {
            $query->where('project_id', $projectId);
        })->with(['task', 'dependsOnTask'])->get();
    }

    public function createDependency(DependencyDTO $dto): TaskDependency
    {
        return TaskDependency::create($dto->toArray());
    }

    public function deleteDependency(string $id): bool
    {
        $dependency = TaskDependency::findOrFail($id);
        return $dependency->delete();
    }

    public function validateDependency(DependencyDTO $dto): bool
    {
        // Verificar se não cria ciclo
        return !$this->wouldCreateCycle($dto->taskId, $dto->dependsOnTaskId);
    }

    private function wouldCreateCycle(string $taskId, string $dependsOnTaskId): bool
    {
        // Implementar detecção de ciclos
        return false;
    }
}
