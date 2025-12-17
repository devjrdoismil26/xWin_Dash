<?php

namespace App\Domains\Activity\Application\Handlers;

use App\Domains\Activity\Application\Queries\ListActivityLogsQuery;
use App\Domains\Activity\Domain\Repositories\ActivityLogRepositoryInterface;
use Illuminate\Support\Facades\Log;

class ListActivityLogsHandler
{
    public function __construct(
        private ActivityLogRepositoryInterface $activityLogRepository
    ) {
    }

    public function handle(ListActivityLogsQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'action' => $query->action,
                'entity_type' => $query->entityType,
                'entity_id' => $query->entityId,
                'user_id' => $query->userId,
                'level' => $query->level,
                'date_from' => $query->dateFrom,
                'date_to' => $query->dateTo
            ];

            // Remover filtros vazios
            $filters = array_filter($filters, function ($value) {
                return $value !== null && $value !== '';
            });

            // Preparar opções de paginação
            $paginationOptions = [
                'page' => $query->page ?? 1,
                'per_page' => $query->perPage ?? 20,
                'sort_by' => $query->sortBy ?? 'created_at',
                'sort_direction' => $query->sortDirection ?? 'desc'
            ];

            // Buscar logs
            $result = $this->activityLogRepository->findByFilters($filters, $paginationOptions);

            Log::info('Activity logs listed successfully', [
                'count' => count($result['data']),
                'filters' => $filters
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error listing activity logs', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(ListActivityLogsQuery $query): void
    {
        // Query de listagem não precisa de validações específicas
    }
}
