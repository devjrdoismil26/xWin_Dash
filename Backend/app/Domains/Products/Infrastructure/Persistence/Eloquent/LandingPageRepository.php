<?php

namespace App\Domains\Products\Infrastructure\Persistence\Eloquent;

use App\Domains\Products\Domain\LandingPage;
use App\Domains\Products\Domain\LandingPageRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class LandingPageRepository implements LandingPageRepositoryInterface
{
    public function __construct(private readonly LandingPageModel $model)
    {
    }

    public function getAll(int $perPage = 15)
    {
        $models = $this->model->paginate($perPage);

        return $models->through(fn (LandingPageModel $model) => $this->toDomain($model));
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
            projectId: $model->project_id,
            status: $model->status,
            content: $model->content,
            productId: $model->product_id,
            leadCaptureFormId: $model->lead_capture_form_id,
            userId: $model->user_id ?? null, // Assuming user_id exists on the model
            id: $model->id,
            createdAt: $model->created_at ? new \DateTime($model->created_at->toDateTimeString()) : null,
            updatedAt: $model->updated_at ? new \DateTime($model->updated_at->toDateTimeString()) : null
        );
    }
}
