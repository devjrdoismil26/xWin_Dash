<?php

namespace App\Domains\Activity\Application\Services;

use App\Domains\Activity\Domain\Repositories\ActivityLogRepositoryInterface;
use App\Domains\Activity\Domain\Entities\ActivityLog;
use App\Domains\Activity\Application\DTOs\ActivityLogDTO;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ActivityLogService
{
    public function __construct(
        private ActivityLogRepositoryInterface $repository
    ) {
    }

    /**
     * Create a new activity log entry.
     */
    public function create(ActivityLogDTO $dto): ActivityLog
    {
        return $this->repository->create($dto);
    }

    /**
     * Find activity log by ID.
     */
    public function findById(string $id): ?ActivityLog
    {
        return $this->repository->findById($id);
    }

    /**
     * Get all activity logs with pagination.
     */
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getAll($perPage);
    }

    /**
     * Get activity logs with filters.
     */
    public function getWithFilters(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getWithFilters($filters, $perPage);
    }

    /**
     * Get activity statistics.
     */
    public function getStats(array $filters = []): array
    {
        return $this->repository->getStats($filters);
    }

    /**
     * Export activity logs.
     */
    public function export(array $filters = [], string $format = 'csv'): string
    {
        return $this->repository->export($filters, $format);
    }

    /**
     * Get recent updates.
     */
    public function getRecentUpdates(int $limit = 10): Collection
    {
        return $this->repository->getRecentUpdates($limit);
    }

    /**
     * Bulk delete activity logs.
     */
    public function bulkDelete(array $ids): int
    {
        return $this->repository->bulkDelete($ids);
    }

    /**
     * Get available filters.
     */
    public function getAvailableFilters(): array
    {
        return $this->repository->getAvailableFilters();
    }

    /**
     * Clean old logs.
     */
    public function cleanOldLogs(int $days = 90): int
    {
        return $this->repository->cleanOldLogs($days);
    }

    /**
     * Get activity logs by user.
     */
    public function getByUser(string $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getByUser($userId, $perPage);
    }

    /**
     * Get activity logs by module.
     */
    public function getByModule(string $module, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getByModule($module, $perPage);
    }

    /**
     * Get activity logs by date range.
     */
    public function getByDateRange(string $startDate, string $endDate, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getByDateRange($startDate, $endDate, $perPage);
    }

    /**
     * Log user activity.
     */
    public function logUserActivity(
        string $logName,
        string $description,
        ?string $subjectType = null,
        ?string $subjectId = null,
        ?string $causerType = null,
        ?string $causerId = null,
        ?array $properties = null
    ): ActivityLog {
        $dto = new ActivityLogDTO(
            logName: $logName,
            description: $description,
            subjectType: $subjectType,
            subjectId: $subjectId,
            causerType: $causerType,
            causerId: $causerId,
            properties: $properties
        );

        return $this->create($dto);
    }

    /**
     * Log system activity.
     */
    public function logSystemActivity(
        string $logName,
        string $description,
        ?string $subjectType = null,
        ?string $subjectId = null,
        ?array $properties = null
    ): ActivityLog {
        return $this->logUserActivity(
            logName: $logName,
            description: $description,
            subjectType: $subjectType,
            subjectId: $subjectId,
            causerType: 'App\\Models\\System',
            causerId: null,
            properties: $properties
        );
    }

    /**
     * Log error activity.
     */
    public function logError(
        string $errorMessage,
        ?string $errorCode = null,
        ?string $subjectType = null,
        ?string $subjectId = null,
        ?string $causerType = null,
        ?string $causerId = null,
        ?array $additionalProperties = null
    ): ActivityLog {
        $properties = array_merge($additionalProperties ?? [], [
            'error_code' => $errorCode,
            'error_message' => $errorMessage,
            'timestamp' => now()->toISOString(),
            'severity' => 'error'
        ]);

        return $this->logUserActivity(
            logName: 'error_occurred',
            description: "Error: {$errorMessage}",
            subjectType: $subjectType,
            subjectId: $subjectId,
            causerType: $causerType,
            causerId: $causerId,
            properties: $properties
        );
    }

    /**
     * Log performance activity.
     */
    public function logPerformance(
        string $operation,
        float $duration,
        ?int $memoryUsage = null,
        ?float $cpuUsage = null,
        ?string $subjectType = null,
        ?string $subjectId = null,
        ?string $causerType = null,
        ?string $causerId = null
    ): ActivityLog {
        $properties = [
            'operation' => $operation,
            'duration' => $duration,
            'memory_usage' => $memoryUsage,
            'cpu_usage' => $cpuUsage,
            'timestamp' => now()->toISOString(),
            'performance_metrics' => true
        ];

        return $this->logUserActivity(
            logName: 'performance_measurement',
            description: "Performance: {$operation} took {$duration}ms",
            subjectType: $subjectType,
            subjectId: $subjectId,
            causerType: $causerType,
            causerId: $causerId,
            properties: $properties
        );
    }
}
