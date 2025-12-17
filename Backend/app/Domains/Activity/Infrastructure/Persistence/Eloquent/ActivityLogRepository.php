<?php

namespace App\Domains\Activity\Infrastructure\Persistence\Eloquent;

use App\Domains\Activity\Domain\Repositories\ActivityLogRepositoryInterface;
use App\Domains\Activity\Domain\Entities\ActivityLog as ActivityLogEntity;
use App\Domains\Activity\Application\DTOs\ActivityLogDTO;
use App\Domains\Activity\Models\ActivityLog;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ActivityLogRepository implements ActivityLogRepositoryInterface
{
    public function create(ActivityLogDTO $dto): ActivityLogEntity
    {
        $model = ActivityLog::create([
            'log_name' => $dto->logName,
            'description' => $dto->description,
            'subject_type' => $dto->subjectType,
            'subject_id' => $dto->subjectId,
            'causer_type' => $dto->causerType,
            'causer_id' => $dto->causerId,
            'properties' => $dto->properties,
        ]);

        return $this->toEntity($model);
    }

    public function findById(string $id): ?ActivityLogEntity
    {
        $model = ActivityLog::find($id);
        return $model ? $this->toEntity($model) : null;
    }

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return ActivityLog::orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getWithFilters(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = ActivityLog::query();

        if (!empty($filters['log_name'])) {
            $query->where('log_name', $filters['log_name']);
        }

        if (!empty($filters['causer_id'])) {
            $query->where('causer_id', $filters['causer_id']);
        }

        if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getStats(array $filters = []): array
    {
        return [
            'total' => ActivityLog::count(),
            'today' => ActivityLog::whereDate('created_at', today())->count(),
        ];
    }

    public function export(array $filters = [], string $format = 'csv'): string
    {
        return '';
    }

    public function getRecentUpdates(int $limit = 10): Collection
    {
        return ActivityLog::orderBy('created_at', 'desc')->limit($limit)->get();
    }

    public function bulkDelete(array $ids): int
    {
        return ActivityLog::whereIn('id', $ids)->delete();
    }

    public function getAvailableFilters(): array
    {
        return [];
    }

    public function cleanOldLogs(int $days = 90): int
    {
        return ActivityLog::where('created_at', '<', now()->subDays($days))->delete();
    }

    public function getByUser(string $userId, int $perPage = 15): LengthAwarePaginator
    {
        return ActivityLog::where('causer_id', $userId)->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getByModule(string $module, int $perPage = 15): LengthAwarePaginator
    {
        return ActivityLog::where('log_name', 'like', "%{$module}%")->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getByDateRange(string $startDate, string $endDate, int $perPage = 15): LengthAwarePaginator
    {
        return ActivityLog::whereBetween('created_at', [$startDate, $endDate])->orderBy('created_at', 'desc')->paginate($perPage);
    }

    private function toEntity(ActivityLog $model): ActivityLogEntity
    {
        return new ActivityLogEntity(
            id: $model->id,
            logName: $model->log_name,
            description: $model->description,
            subjectType: $model->subject_type,
            subjectId: $model->subject_id,
            causerType: $model->causer_type,
            causerId: $model->causer_id,
            properties: $model->properties,
            createdAt: $model->created_at,
            updatedAt: $model->updated_at
        );
    }
}
