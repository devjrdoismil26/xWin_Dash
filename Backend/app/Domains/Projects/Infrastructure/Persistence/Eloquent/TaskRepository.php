<?php

namespace App\Domains\Projects\Infrastructure\Persistence\Eloquent;

use App\Domains\Projects\Domain\Task;
use App\Domains\Projects\Domain\TaskRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class TaskRepository implements TaskRepositoryInterface
{
    public function __construct(private readonly TaskModel $model)
    {
    }

    public function find(string $id): ?Task
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByProjectId(string $projectId): Collection
    {
        $models = $this->model->where('project_id', $projectId)->get();
        return $models->map(fn (TaskModel $model) => $this->toDomain($model));
    }

    public function create(array $data): Task
    {
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    public function update(string $id, array $data): bool
    {
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return $model->update($data);
    }

    public function delete(string $id): bool
    {
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return $model->delete();
    }

    private function toDomain(TaskModel $model): Task
    {
        return new Task(
            title: $model->name, // Usando 'name' do model como 'title' do Domain
            status: $model->status,
            projectId: (int) $model->project_id,
            description: $model->description,
            assignedToUserId: $model->assigned_to_user_id ? (int) $model->assigned_to_user_id : null,
            dueDate: $model->due_date ? $model->due_date->toDateTime() : null,
            id: (int) $model->id,
            createdAt: $model->created_at ? $model->created_at->toDateTime() : null,
            updatedAt: $model->updated_at ? $model->updated_at->toDateTime() : null,
        );
    }
}
