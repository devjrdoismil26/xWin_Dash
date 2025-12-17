<?php

namespace App\Domains\Integrations\Application\Handlers;

use App\Domains\Integrations\Application\Queries\GetIntegrationLogsQuery;
use App\Domains\Integrations\Repositories\IntegrationRepository;
use App\Domains\Integrations\Repositories\IntegrationLogRepository;
use App\Domains\Integrations\Exceptions\IntegrationNotFoundException;

class GetIntegrationLogsHandler
{
    public function __construct(
        private IntegrationRepository $integrationRepository,
        private IntegrationLogRepository $integrationLogRepository
    ) {
    }

    public function handle(GetIntegrationLogsQuery $query): array
    {
        $integration = $this->integrationRepository->findById($query->integrationId);

        if (!$integration) {
            throw new IntegrationNotFoundException(
                "Integration with ID {$query->integrationId} not found"
            );
        }

        $filters = [
            'integration_id' => $query->integrationId,
            'level' => $query->level,
            'action' => $query->action,
            'date_from' => $query->dateFrom,
            'date_to' => $query->dateTo
        ];

        $logs = $this->integrationLogRepository->findByFilters(
            $filters,
            $query->limit,
            $query->offset,
            'created_at',
            'desc'
        );

        $total = $this->integrationLogRepository->countByFilters($filters);

        return [
            'integration_id' => $integration->id,
            'integration_name' => $integration->name,
            'logs' => $logs->map(function ($log) {
                return [
                    'id' => $log->id,
                    'level' => $log->level,
                    'action' => $log->action,
                    'message' => $log->message,
                    'context' => $log->context,
                    'duration' => $log->duration,
                    'status' => $log->status,
                    'created_at' => $log->created_at->toISOString()
                ];
            })->toArray(),
            'pagination' => [
                'total' => $total,
                'limit' => $query->limit,
                'offset' => $query->offset,
                'has_more' => ($query->offset + $query->limit) < $total
            ],
            'summary' => [
                'total_logs' => $total,
                'error_count' => $logs->where('level', 'error')->count(),
                'warning_count' => $logs->where('level', 'warning')->count(),
                'info_count' => $logs->where('level', 'info')->count()
            ]
        ];
    }
}
