<?php

namespace App\Domains\Activity\Application\Services;

use App\Domains\Activity\Application\Commands\LogActivityCommand;
use App\Domains\Activity\Application\Commands\CreateActivityLogCommand;
use App\Domains\Activity\Application\Commands\UpdateActivityLogCommand;
use App\Domains\Activity\Application\Commands\DeleteActivityLogCommand;
use App\Domains\Activity\Application\Commands\CleanupActivityLogsCommand;
use App\Domains\Activity\Application\Queries\GetActivityLogQuery;
use App\Domains\Activity\Application\Queries\ListActivityLogsQuery;
use App\Domains\Activity\Application\Queries\GetUserActivityQuery;
use App\Domains\Activity\Application\Queries\GetEntityActivityQuery;
use App\Domains\Activity\Application\UseCases\LogActivityUseCase;
use App\Domains\Activity\Application\UseCases\CreateActivityLogUseCase;
use App\Domains\Activity\Application\UseCases\UpdateActivityLogUseCase;
use App\Domains\Activity\Application\UseCases\DeleteActivityLogUseCase;
use App\Domains\Activity\Application\UseCases\CleanupActivityLogsUseCase;
use App\Domains\Activity\Application\UseCases\GetActivityLogUseCase;
use App\Domains\Activity\Application\UseCases\ListActivityLogsUseCase;
use App\Domains\Activity\Application\UseCases\GetUserActivityUseCase;
use App\Domains\Activity\Application\UseCases\GetEntityActivityUseCase;
use Illuminate\Support\Facades\Log;

class ActivityApplicationService
{
    public function __construct(
        private LogActivityUseCase $logActivityUseCase,
        private CreateActivityLogUseCase $createActivityLogUseCase,
        private UpdateActivityLogUseCase $updateActivityLogUseCase,
        private DeleteActivityLogUseCase $deleteActivityLogUseCase,
        private CleanupActivityLogsUseCase $cleanupActivityLogsUseCase,
        private GetActivityLogUseCase $getActivityLogUseCase,
        private ListActivityLogsUseCase $listActivityLogsUseCase,
        private GetUserActivityUseCase $getUserActivityUseCase,
        private GetEntityActivityUseCase $getEntityActivityUseCase
    ) {
    }

    public function logActivity(array $data): array
    {
        $command = new LogActivityCommand(
            action: $data['action'],
            description: $data['description'] ?? null,
            entityType: $data['entity_type'] ?? null,
            entityId: $data['entity_id'] ?? null,
            userId: $data['user_id'] ?? null,
            metadata: $data['metadata'] ?? null,
            ipAddress: $data['ip_address'] ?? null,
            userAgent: $data['user_agent'] ?? null
        );

        return $this->logActivityUseCase->execute($command);
    }

    public function createActivityLog(array $data): array
    {
        $command = new CreateActivityLogCommand(
            action: $data['action'],
            description: $data['description'],
            entityType: $data['entity_type'] ?? null,
            entityId: $data['entity_id'] ?? null,
            userId: $data['user_id'] ?? null,
            metadata: $data['metadata'] ?? null,
            ipAddress: $data['ip_address'] ?? null,
            userAgent: $data['user_agent'] ?? null,
            level: $data['level'] ?? 'info'
        );

        return $this->createActivityLogUseCase->execute($command);
    }

    public function updateActivityLog(int $activityId, array $data): array
    {
        $command = new UpdateActivityLogCommand(
            activityId: $activityId,
            description: $data['description'] ?? null,
            metadata: $data['metadata'] ?? null,
            level: $data['level'] ?? null
        );

        return $this->updateActivityLogUseCase->execute($command);
    }

    public function deleteActivityLog(int $activityId, bool $forceDelete = false): array
    {
        $command = new DeleteActivityLogCommand(
            activityId: $activityId,
            forceDelete: $forceDelete
        );

        return $this->deleteActivityLogUseCase->execute($command);
    }

    public function cleanupActivityLogs(?string $olderThan = null, ?string $action = null, ?string $level = null, bool $dryRun = false): array
    {
        $command = new CleanupActivityLogsCommand(
            olderThan: $olderThan,
            action: $action,
            level: $level,
            dryRun: $dryRun
        );

        return $this->cleanupActivityLogsUseCase->execute($command);
    }

    public function getActivityLog(int $activityId, bool $includeMetadata = false, bool $includeUser = false): array
    {
        $query = new GetActivityLogQuery(
            activityId: $activityId,
            includeMetadata: $includeMetadata,
            includeUser: $includeUser
        );

        return $this->getActivityLogUseCase->execute($query);
    }

    public function listActivityLogs(array $filters = [], int $page = 1, int $perPage = 20, string $sortBy = 'created_at', string $sortDirection = 'desc'): array
    {
        $query = new ListActivityLogsQuery(
            action: $filters['action'] ?? null,
            entityType: $filters['entity_type'] ?? null,
            entityId: $filters['entity_id'] ?? null,
            userId: $filters['user_id'] ?? null,
            level: $filters['level'] ?? null,
            dateFrom: $filters['date_from'] ?? null,
            dateTo: $filters['date_to'] ?? null,
            page: $page,
            perPage: $perPage,
            sortBy: $sortBy,
            sortDirection: $sortDirection
        );

        return $this->listActivityLogsUseCase->execute($query);
    }

    public function getUserActivity(int $userId, ?string $action = null, ?string $dateFrom = null, ?string $dateTo = null, int $page = 1, int $perPage = 20): array
    {
        $query = new GetUserActivityQuery(
            userId: $userId,
            action: $action,
            dateFrom: $dateFrom,
            dateTo: $dateTo,
            page: $page,
            perPage: $perPage
        );

        return $this->getUserActivityUseCase->execute($query);
    }

    public function getEntityActivity(string $entityType, int $entityId, ?string $action = null, ?string $dateFrom = null, ?string $dateTo = null, int $page = 1, int $perPage = 20): array
    {
        $query = new GetEntityActivityQuery(
            entityType: $entityType,
            entityId: $entityId,
            action: $action,
            dateFrom: $dateFrom,
            dateTo: $dateTo,
            page: $page,
            perPage: $perPage
        );

        return $this->getEntityActivityUseCase->execute($query);
    }
}
