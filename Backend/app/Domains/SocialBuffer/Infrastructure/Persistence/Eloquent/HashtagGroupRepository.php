<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\SocialBuffer\Domain\HashtagGroup;
use App\Domains\SocialBuffer\Domain\HashtagGroupRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class HashtagGroupRepository implements HashtagGroupRepositoryInterface
{
    public function __construct(private readonly HashtagGroupModel $model)
    {
    }

    public function find(string $id): ?HashtagGroup
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByUserId(string $userId): Collection
    {
        $models = $this->model->where('user_id', $userId)->get();
        return $models->map(fn (HashtagGroupModel $model) => $this->toDomain($model));
    }

    public function create(array $data): HashtagGroup
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

    private function toDomain(HashtagGroupModel $model): HashtagGroup
    {
        return new HashtagGroup(
            id: $model->id,
            userId: $model->user_id,
            name: $model->name,
            hashtags: $model->hashtags,
            createdAt: $model->created_at ? DateTimeImmutable::createFromMutable($model->created_at) : null,
            updatedAt: $model->updated_at ? DateTimeImmutable::createFromMutable($model->updated_at) : null,
        );
    }
}
