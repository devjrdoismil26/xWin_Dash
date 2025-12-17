<?php

namespace App\Domains\Projects\Infrastructure\Persistence\Eloquent;

use App\Domains\Projects\Domain\LeadCaptureForm;
use App\Domains\Projects\Domain\LeadCaptureFormRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class LeadCaptureFormRepository implements LeadCaptureFormRepositoryInterface
{
    public function __construct(private readonly LeadCaptureFormModel $model)
    {
    }

    public function find(string $id): ?LeadCaptureForm
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByProjectId(string $projectId): Collection
    {
        $models = $this->model->where('project_id', $projectId)->get();
        return $models->map(fn (LeadCaptureFormModel $model) => $this->toDomain($model));
    }

    public function create(array $data): LeadCaptureForm
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

    private function toDomain(LeadCaptureFormModel $model): LeadCaptureForm
    {
        return new LeadCaptureForm(
            name: $model->name,
            fields: $model->fields ?? [],
            projectId: (int) $model->project_id,
            userId: $model->user_id ?? 0,
            description: $model->description,
            id: (int) $model->id,
            createdAt: $model->created_at ? $model->created_at->toDateTime() : null,
            updatedAt: $model->updated_at ? $model->updated_at->toDateTime() : null,
        );
    }
}
