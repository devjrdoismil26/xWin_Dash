<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\SocialBuffer\Domain\Analytics;
use App\Domains\SocialBuffer\Domain\AnalyticsRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class AnalyticsRepository implements AnalyticsRepositoryInterface
{
    public function __construct(private readonly AnalyticsModel $model)
    {
    }

    public function find(string $id): ?Analytics
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByPostId(string $postId): Collection
    {
        $models = $this->model->where('post_id', $postId)->get();
        return $models->map(fn (AnalyticsModel $model) => $this->toDomain($model));
    }

    public function create(array $data): Analytics
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

    private function toDomain(AnalyticsModel $model): Analytics
    {
        return new Analytics(
            id: $model->id,
            platform: $model->platform,
            metricType: $model->metric_type,
            metricValue: $model->metric_value,
            metricDate: $model->metric_date,
            collectedAt: $model->collected_at,
            postId: $model->post_id,
            scheduleId: $model->schedule_id,
            additionalData: $model->additional_data,
            createdAt: $model->created_at ? DateTimeImmutable::createFromMutable($model->created_at) : null,
            updatedAt: $model->updated_at ? DateTimeImmutable::createFromMutable($model->updated_at) : null,
        );
    }
}
