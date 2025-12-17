<?php

namespace App\Domains\Activity\Application\Handlers;

use App\Domains\Activity\Application\Queries\GetActivityLogQuery;
use App\Domains\Activity\Domain\Repositories\ActivityLogRepositoryInterface;
use App\Domains\Activity\Domain\Services\ActivityLogService;
use Illuminate\Support\Facades\Log;

class GetActivityLogHandler
{
    public function __construct(
        private ActivityLogRepositoryInterface $activityLogRepository,
        private ActivityLogService $activityLogService
    ) {
    }

    public function handle(GetActivityLogQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar o log
            $activityLog = $this->activityLogRepository->findById($query->activityId);

            if (!$activityLog) {
                return null;
            }

            // Enriquecer com dados se solicitado
            $result = $activityLog->toArray();

            if ($query->includeMetadata) {
                $result['metadata'] = $this->activityLogService->getActivityMetadata($activityLog);
            }

            if ($query->includeUser) {
                $result['user'] = $this->activityLogService->getActivityUser($activityLog);
            }

            Log::info('Activity log retrieved successfully', [
                'activity_id' => $query->activityId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving activity log', [
                'activity_id' => $query->activityId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetActivityLogQuery $query): void
    {
        if (empty($query->activityId)) {
            throw new \InvalidArgumentException('ID do log é obrigatório');
        }
    }
}
