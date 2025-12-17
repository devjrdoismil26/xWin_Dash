<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Aura\Domain\AuraMessage;
use App\Domains\Aura\Domain\AuraMessageRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class AuraMessageRepository implements AuraMessageRepositoryInterface
{
    public function __construct(private readonly AuraMessageModel $model)
    {
    }

    public function find(string $id): ?AuraMessage
    {
        /** @var AuraMessageModel|null $model */
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * @return Collection<int, AuraMessage>
     */
    public function findByChatId(string $chatId): Collection
    {
        /** @var EloquentCollection<int, AuraMessageModel> $models */
        $models = $this->model->where('aura_chat_id', $chatId)->get();
        return $models->map(fn (AuraMessageModel $model) => $this->toDomain($model));
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraMessage
    {
        /** @var AuraMessageModel $model */
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool
    {
        /** @var AuraMessageModel|null $model */
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return $model->update($data);
    }

    public function delete(string $id): bool
    {
        /** @var AuraMessageModel|null $model */
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return (bool) $model->delete();
    }

    private function toDomain(AuraMessageModel $model): AuraMessage
    {
        return AuraMessage::fromArray($model->toArray());
    }
}
