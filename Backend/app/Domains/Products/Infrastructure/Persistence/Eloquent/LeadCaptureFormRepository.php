<?php

namespace App\Domains\Products\Infrastructure\Persistence\Eloquent;

use App\Domains\Products\Domain\LeadCaptureForm;
use App\Domains\Products\Domain\LeadCaptureFormRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class LeadCaptureFormRepository implements LeadCaptureFormRepositoryInterface
{
    public function __construct(private readonly LeadCaptureFormModel $model)
    {
    }

    public function getAll(int $perPage = 15)
    {
        $models = $this->model->paginate($perPage);

        return $models->through(fn (LeadCaptureFormModel $model) => $this->toDomain($model));
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
            fields: $model->fields,
            projectId: $model->project_id,
            title: $model->title,
            buttonText: $model->button_text,
            slug: $model->slug,
            status: $model->status,
            isActive: $model->is_active,
            description: $model->description,
            redirectUrl: $model->redirect_url,
            webhookUrl: $model->webhook_url,
            userId: $model->user_id ?? null,
            id: $model->id,
            createdAt: $model->created_at ? new \DateTime($model->created_at->toDateTimeString()) : null,
            updatedAt: $model->updated_at ? new \DateTime($model->updated_at->toDateTimeString()) : null
        );
    }
}
