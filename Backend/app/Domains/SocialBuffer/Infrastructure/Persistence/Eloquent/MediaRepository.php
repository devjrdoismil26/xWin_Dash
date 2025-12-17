<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\SocialBuffer\Domain\Media;
use App\Domains\SocialBuffer\Domain\MediaRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class MediaRepository implements MediaRepositoryInterface
{
    public function __construct(private readonly MediaModel $model)
    {
    }

    public function find(string $id): ?Media
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByUserId(string $userId): Collection
    {
        $models = $this->model->where('user_id', $userId)->get();
        return $models->map(fn (MediaModel $model) => $this->toDomain($model));
    }

    public function create(array $data): Media
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

    private function toDomain(MediaModel $model): Media
    {
        return new Media(
            id: $model->id,
            userId: $model->user_id,
            fileName: $model->file_name,
            filePath: $model->file_path,
            fileType: $model->file_type,
            disk: $model->disk,
            mimeType: $model->mime_type,
            fileSize: $model->file_size,
            metadata: $model->metadata,
            name: $model->name,
            url: $model->url,
            type: $model->type,
            projectId: $model->project_id,
            createdAt: $model->created_at ? DateTimeImmutable::createFromMutable($model->created_at) : null,
            updatedAt: $model->updated_at ? DateTimeImmutable::createFromMutable($model->updated_at) : null,
        );
    }
}
