<?php

namespace App\Domains\Categorization\Infrastructure\Persistence\Eloquent;

use App\Domains\Categorization\Domain\Tag;
use App\Domains\Categorization\Domain\TagRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class TagRepository implements TagRepositoryInterface
{
    public function __construct(private readonly TagModel $model)
    {
    }

    public function find(string $id): ?Tag
    {
        $model = $this->model->find($id);

        return $model ? $this->toDomain($model) : null;
    }

    public function findByProjectId(string $projectId): Collection
    {
        $models = $this->model->where('project_id', $projectId)->get();

        return $models->map(fn (TagModel $model) => $this->toDomain($model));
    }

    public function create(array $data): Tag
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

    private function toDomain(TagModel $model): Tag
    {
        return new Tag(
            id: $model->id,
            name: $model->name,
            projectId: $model->project_id,
            color: $model->color,
            description: $model->description,
            createdAt: $model->created_at ? DateTimeImmutable::createFromMutable($model->created_at) : null,
            updatedAt: $model->updated_at ? DateTimeImmutable::createFromMutable($model->updated_at) : null,
        );
    }
}
