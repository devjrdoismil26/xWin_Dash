<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\SocialBuffer\Domain\ShortenedLink;
use App\Domains\SocialBuffer\Domain\ShortenedLinkRepositoryInterface;
use DateTimeImmutable;

class ShortenedLinkRepository implements ShortenedLinkRepositoryInterface
{
    public function __construct(private readonly ShortenedLinkModel $model)
    {
    }

    public function find(string $id): ?ShortenedLink
    {
        $model = $this->model->find($id);

        return $model ? $this->toDomain($model) : null;
    }

    public function findByShortCode(string $shortCode): ?ShortenedLink
    {
        $model = $this->model->where('short_code', $shortCode)->first();

        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): ShortenedLink
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

    private function toDomain(ShortenedLinkModel $model): ShortenedLink
    {
        return new ShortenedLink(
            id: $model->id,
            userId: $model->user_id,
            projectId: $model->project_id,
            longUrl: $model->long_url,
            shortCode: $model->short_code,
            clicks: $model->clicks,
            createdAt: $model->created_at ? DateTimeImmutable::createFromMutable($model->created_at) : null,
            updatedAt: $model->updated_at ? DateTimeImmutable::createFromMutable($model->updated_at) : null,
        );
    }
}
