<?php

namespace App\Domains\Activity\Application\Handlers;

use App\Domains\Activity\Application\Queries\GetEntityActivityQuery;
use App\Domains\Activity\Domain\Repositories\ActivityLogRepositoryInterface;
use Illuminate\Support\Facades\Log;

class GetEntityActivityHandler
{
    public function __construct(
        private ActivityLogRepositoryInterface $activityLogRepository
    ) {
    }

    public function handle(GetEntityActivityQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'entity_type' => $query->entityType,
                'entity_id' => $query->entityId,
                'action' => $query->action,
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
                'sort_by' => 'created_at',
                'sort_direction' => 'desc'
            ];

            // Buscar atividades da entidade
            $result = $this->activityLogRepository->findByFilters($filters, $paginationOptions);

            Log::info('Entity activity retrieved successfully', [
                'entity_type' => $query->entityType,
                'entity_id' => $query->entityId,
                'count' => count($result['data'] ?? [])
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving entity activity', [
                'entity_type' => $query->entityType,
                'entity_id' => $query->entityId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetEntityActivityQuery $query): void
    {
        if (empty($query->entityType)) {
            throw new \InvalidArgumentException('Tipo da entidade é obrigatório');
        }

        if (empty($query->entityId)) {
            throw new \InvalidArgumentException('ID da entidade é obrigatório');
        }
    }
}
