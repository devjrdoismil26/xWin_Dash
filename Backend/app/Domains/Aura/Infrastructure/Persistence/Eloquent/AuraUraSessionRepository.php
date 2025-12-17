<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Aura\Domain\AuraUraSession;
use App\Domains\Aura\Domain\AuraUraSessionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class AuraUraSessionRepository implements AuraUraSessionRepositoryInterface
{
    public function __construct(
        private readonly AuraUraSessionModel $model
    ) {
    }

    public function find(string $id): ?AuraUraSession
    {
        /** @var AuraUraSessionModel|null $model */
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraUraSession
    {
        /** @var AuraUraSessionModel $model */
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool
    {
        /** @var AuraUraSessionModel|null $model */
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return $model->update($data);
    }

    public function delete(string $id): bool
    {
        /** @var AuraUraSessionModel|null $model */
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return (bool) $model->delete();
    }

    /**
     * @return Collection<int, AuraUraSession>
     */
    public function findByChatId(string $chatId): Collection
    {
        /** @var EloquentCollection<int, AuraUraSessionModel> $models */
        $models = $this->model->where('chat_id', $chatId)->get();
        return $models->map(fn(AuraUraSessionModel $model) => $this->toDomain($model));
    }

    private function toDomain(AuraUraSessionModel $model): AuraUraSession
    {
        return AuraUraSession::fromArray($model->toArray());
    }
}
