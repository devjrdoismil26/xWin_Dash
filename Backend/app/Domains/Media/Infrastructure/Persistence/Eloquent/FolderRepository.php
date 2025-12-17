<?php

namespace App\Domains\Media\Infrastructure\Persistence\Eloquent;

use App\Domains\Media\Domain\Folder;
use App\Domains\Media\Domain\FolderRepositoryInterface;
use App\Domains\Media\Models\MediaFolder as FolderModel;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class FolderRepository implements FolderRepositoryInterface
{
    public function __construct(private readonly FolderModel $model)
    {
    }

    public function find(string $id): ?Folder
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByProjectId(string $projectId): Collection
    {
        $models = $this->model->where('project_id', $projectId)->get();
        return $models->map(fn (FolderModel $model) => $this->toDomain($model));
    }

    public function create(array $data): Folder
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

    private function toDomain(FolderModel $model): Folder
    {
        return new Folder(
            id: $model->id,
            projectId: $model->project_id,
            userId: $model->user_id,
            name: $model->name,
            parentId: $model->parent_id,
            createdAt: $model->created_at ? DateTimeImmutable::createFromMutable($model->created_at) : null,
            updatedAt: $model->updated_at ? DateTimeImmutable::createFromMutable($model->updated_at) : null,
        );
    }
}
