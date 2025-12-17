<?php

namespace App\Domains\Dashboard\Infrastructure\Persistence\Eloquent;

use App\Domains\Dashboard\Domain\DashboardWidget;
use App\Domains\Dashboard\Domain\DashboardWidgetRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class DashboardWidgetRepository implements DashboardWidgetRepositoryInterface
{
    public function __construct(private readonly DashboardWidgetModel $model)
    {
    }

    public function find(string $id): ?DashboardWidget
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByUserId(string $userId): Collection
    {
        $models = $this->model->where('user_id', $userId)->get();
        return $models->map(fn (DashboardWidgetModel $model) => $this->toDomain($model));
    }

    public function create(array $data): DashboardWidget
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

    private function toDomain(DashboardWidgetModel $model): DashboardWidget
    {
        return new DashboardWidget(
            id: $model->id,
            userId: $model->user_id,
            type: $model->type,
            config: $model->config,
            createdAt: $model->created_at ? DateTimeImmutable::createFromMutable($model->created_at) : null,
            updatedAt: $model->updated_at ? DateTimeImmutable::createFromMutable($model->updated_at) : null,
        );
    }
}
