<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Aura\Domain\AuraStats;
use App\Domains\Aura\Domain\AuraStatsRepositoryInterface;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class AuraStatsRepository implements AuraStatsRepositoryInterface
{
    public function __construct(private readonly AuraStatsModel $model)
    {
    }

    public function find(string $id): ?AuraStats
    {
        /** @var AuraStatsModel|null $model */
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * @return Collection<int, AuraStats>
     */
    public function all(): Collection
    {
        /** @var EloquentCollection<int, AuraStatsModel> $models */
        $models = $this->model->all();
        return $models->map(fn (AuraStatsModel $model) => $this->toDomain($model));
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraStats
    {
        /** @var AuraStatsModel $model */
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool
    {
        /** @var AuraStatsModel|null $model */
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return $model->update($data);
    }

    public function delete(string $id): bool
    {
        /** @var AuraStatsModel|null $model */
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return (bool) $model->delete();
    }

    private function toDomain(AuraStatsModel $model): AuraStats
    {
        return AuraStats::fromArray($model->toArray());
    }
}
