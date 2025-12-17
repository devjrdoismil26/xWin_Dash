<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Aura\Domain\AuraConnection;
use App\Domains\Aura\Domain\AuraConnectionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class AuraConnectionRepository implements AuraConnectionRepositoryInterface
{
    public function __construct(
        private readonly AuraConnectionModel $model
    ) {
    }

    public function find(string $id): ?AuraConnection
    {
        /** @var AuraConnectionModel|null $model */
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraConnection
    {
        /** @var AuraConnectionModel $model */
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool
    {
        /** @var AuraConnectionModel|null $model */
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
     * @return Collection<int, AuraConnection>
     */
    public function findByUserId(string $userId): Collection
    {
        /** @var EloquentCollection<int, AuraConnectionModel> $models */
        $models = $this->model->where('user_id', $userId)->get();
        return $models->map(fn(AuraConnectionModel $model) => $this->toDomain($model));
    }

    private function toDomain(AuraConnectionModel $model): AuraConnection
    {
        return AuraConnection::fromArray($model->toArray());
    }
}
