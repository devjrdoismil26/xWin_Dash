<?php

namespace App\Domains\Projects\Infrastructure\Persistence\Eloquent;

use App\Domains\Projects\Domain\LandingPage;
use App\Domains\Projects\Domain\LandingPageRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class LandingPageRepository implements LandingPageRepositoryInterface
{
    public function __construct(private readonly LandingPageModel $model)
    {
    }

    public function find(string $id): ?LandingPage
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByProjectId(string $projectId): Collection
    {
        $models = $this->model->where('project_id', $projectId)->get();
        return $models->map(fn (LandingPageModel $model) => $this->toDomain($model));
    }

    public function create(array $data): LandingPage
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

    private function toDomain(LandingPageModel $model): LandingPage
    {
        return new LandingPage(
            name: $model->name,
            slug: $model->slug,
            content: is_array($model->content) ? json_encode($model->content) : ($model->content ?? ''),
            projectId: (int) $model->project_id,
            userId: $model->user_id,
            id: (int) $model->id,
            createdAt: $model->created_at ? $model->created_at->toDateTime() : null,
            updatedAt: $model->updated_at ? $model->updated_at->toDateTime() : null,
        );
    }
}
