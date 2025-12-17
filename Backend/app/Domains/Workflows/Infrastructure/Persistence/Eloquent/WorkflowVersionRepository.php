<?php

namespace App\Domains\Workflows\Infrastructure\Persistence\Eloquent;

use App\Domains\Workflows\Domain\WorkflowVersion;
use App\Domains\Workflows\Domain\WorkflowVersionRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class WorkflowVersionRepository implements WorkflowVersionRepositoryInterface
{
    public function __construct(private readonly WorkflowVersionModel $model)
    {
    }

    public function find(string $id): ?WorkflowVersion
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * @return \Illuminate\Support\Collection<int, WorkflowVersion>
     */
    public function findByWorkflowId(string $workflowId): Collection
    {
        $models = $this->model->where('workflow_id', $workflowId)->get();
        return $models->map(fn (WorkflowVersionModel $model) => $this->toDomain($model));
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): WorkflowVersion
    {
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    /**
     * @param array<string, mixed> $data
     */
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

    private function toDomain(WorkflowVersionModel $model): WorkflowVersion
    {
        return WorkflowVersion::fromArray($model->toArray());
    }
}
