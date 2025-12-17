<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Aura\Domain\AuraChat;
use App\Domains\Aura\Domain\AuraChatRepositoryInterface;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class AuraChatRepository implements AuraChatRepositoryInterface
{
    public function __construct(
        private readonly AuraChatModel $model
    ) {
    }

    public function find(string $id): ?AuraChat
    {
        /** @var AuraChatModel|null $model */
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraChat
    {
        /** @var AuraChatModel $model */
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool
    {
        /** @var AuraChatModel|null $model */
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
     * @return Collection<int, AuraChat>
     */
    public function findByConnectionId(string $connectionId): Collection
    {
        /** @var EloquentCollection<int, AuraChatModel> $models */
        $models = $this->model->where('connection_id', $connectionId)->get();
        return $models->map(fn(AuraChatModel $model) => $this->toDomain($model));
    }

    /**
     * @return Collection<int, AuraChat>
     */
    public function findByLeadId(string $leadId): Collection
    {
        // Assumindo que há uma relação ou campo lead_id
        /** @var EloquentCollection<int, AuraChatModel> $models */
        $models = $this->model->where('lead_id', $leadId)->get();
        return $models->map(fn(AuraChatModel $model) => $this->toDomain($model));
    }

    /**
     * @param array<string, mixed> $attributes
     * @param array<string, mixed> $values
     */
    public function firstOrCreate(array $attributes, array $values = []): AuraChat
    {
        /** @var AuraChatModel $model */
        $model = $this->model->firstOrCreate($attributes, $values);
        return $this->toDomain($model);
    }

    private function toDomain(AuraChatModel $model): AuraChat
    {
        return AuraChat::fromArray($model->toArray());
    }
}
