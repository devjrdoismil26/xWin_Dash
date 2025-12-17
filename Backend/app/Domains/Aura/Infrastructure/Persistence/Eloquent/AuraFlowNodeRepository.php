<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Aura\Domain\AuraFlowNode;
use App\Domains\Aura\Domain\AuraFlowNodeRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class AuraFlowNodeRepository implements AuraFlowNodeRepositoryInterface
{
    public function __construct(private readonly AuraFlowNodeModel $model)
    {
    }

    public function find(string $id): ?AuraFlowNode
    {
        /** @var AuraFlowNodeModel|null $model */
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * @return Collection<int, AuraFlowNode>
     */
    public function findByFlowId(string $flowId): Collection
    {
        /** @var EloquentCollection<int, AuraFlowNodeModel> $models */
        $models = $this->model->where('aura_flow_id', $flowId)->get();
        return $models->map(fn (AuraFlowNodeModel $model) => $this->toDomain($model));
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraFlowNode
    {
        /** @var AuraFlowNodeModel $model */
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool
    {
        /** @var AuraFlowNodeModel|null $model */
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return $model->update($data);
    }

    public function delete(string $id): bool
    {
        /** @var AuraFlowNodeModel|null $model */
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return (bool) $model->delete();
    }

    private function toDomain(AuraFlowNodeModel $model): AuraFlowNode
    {
        return AuraFlowNode::fromArray($model->toArray());
    }
}
