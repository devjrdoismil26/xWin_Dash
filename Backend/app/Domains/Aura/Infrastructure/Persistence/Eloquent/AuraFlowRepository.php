<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Aura\Domain\AuraFlow;
use App\Domains\Aura\Domain\AuraFlowRepositoryInterface;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class AuraFlowRepository implements AuraFlowRepositoryInterface
{
    public function __construct(
        private readonly AuraFlowModel $model
    ) {
    }

    public function find(string $id): ?AuraFlow
    {
        /** @var AuraFlowModel|null $model */
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraFlow
    {
        /** @var AuraFlowModel $model */
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool
    {
        /** @var AuraFlowModel|null $model */
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return $model->update($data);
    }

    public function delete(string $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * @return Collection<int, AuraFlow>
     */
    public function findByConnectionId(string $connectionId): Collection
    {
        /** @var EloquentCollection<int, AuraFlowModel> $models */
        $models = $this->model->where('connection_id', $connectionId)->get();
        return $models->map(fn(AuraFlowModel $model) => $this->toDomain($model));
    }

    /**
     * @return Collection<int, AuraFlow>
     */
    public function findByProjectId(string $projectId): Collection
    {
        // Assumindo que há uma relação ou campo project_id
        /** @var EloquentCollection<int, AuraFlowModel> $models */
        $models = $this->model->where('project_id', $projectId)->get();
        return $models->map(fn(AuraFlowModel $model) => $this->toDomain($model));
    }

    private function toDomain(AuraFlowModel $model): AuraFlow
    {
        return AuraFlow::fromArray($model->toArray());
    }
}
