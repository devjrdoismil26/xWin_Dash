<?php

namespace App\Domains\Workflows\Infrastructure\Persistence\Eloquent;

use App\Domains\Workflows\Domain\WorkflowNode;
use App\Domains\Workflows\Domain\WorkflowNodeRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class WorkflowNodeRepository implements WorkflowNodeRepositoryInterface
{
    public function __construct(private readonly WorkflowNodeModel $model)
    {
    }

    public function find($id): ?WorkflowNode
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * @return \Illuminate\Support\Collection<int, WorkflowNode>
     */
    public function findByWorkflowId($workflowId): Collection
    {
        $models = $this->model->where('workflow_id', $workflowId)->get();
        return $models->map(fn (WorkflowNodeModel $model) => $this->toDomain($model));
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): WorkflowNode
    {
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update($id, array $data): bool
    {
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return $model->update($data);
    }

    public function delete($id): bool
    {
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return $model->delete();
    }

    private function toDomain(WorkflowNodeModel $model): WorkflowNode
    {
        if (class_exists('App\\Domains\\Workflows\\Domain\\WorkflowNode')) {
            return WorkflowNode::fromArray($model->toArray());
        }

        // Fallback if domain entity doesn't exist
        return new class ($model->toArray()) {
            public function __construct(private array $data)
            {
            }
            public function toArray(): array
            {
                return $this->data;
            }
        };
    }
}
