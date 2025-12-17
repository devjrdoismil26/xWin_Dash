<?php

namespace App\Domains\Activity\Domain\Repositories;

use App\Domains\Activity\Domain\Entities\ActivityLog;
use App\Domains\Activity\Application\DTOs\ActivityLogDTO;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ActivityLogRepositoryInterface
{
    public function create(ActivityLogDTO $dto): ActivityLog;
    public function findById(string $id): ?ActivityLog;
    public function getAll(int $perPage = 15): LengthAwarePaginator;
    public function getWithFilters(array $filters, int $perPage = 15): LengthAwarePaginator;
    public function getStats(array $filters = []): array;
    public function export(array $filters = [], string $format = 'csv'): string;
    public function getRecentUpdates(int $limit = 10): Collection;
    public function bulkDelete(array $ids): int;
    public function getAvailableFilters(): array;
    public function cleanOldLogs(int $days = 90): int;
    public function getByUser(string $userId, int $perPage = 15): LengthAwarePaginator;
    public function getByModule(string $module, int $perPage = 15): LengthAwarePaginator;
    public function getByDateRange(string $startDate, string $endDate, int $perPage = 15): LengthAwarePaginator;
}
