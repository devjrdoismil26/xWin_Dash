<?php

namespace App\Domains\Activity\Application\Handlers;

use App\Domains\Activity\Application\Queries\GetUserActivityQuery;
use App\Domains\Activity\Domain\Repositories\ActivityLogRepositoryInterface;
use App\Domains\Activity\Domain\Services\ActivityLogService;
use Illuminate\Support\Facades\Log;

class GetUserActivityHandler
{
    public function __construct(
        private ActivityLogRepositoryInterface $activityLogRepository,
        private ActivityLogService $activityLogService
    ) {
    }

    public function handle(GetUserActivityQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'user_id' => $query->userId,
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

            // Buscar atividades do usuário
            $result = $this->activityLogRepository->findByFilters($filters, $paginationOptions);

            Log::info('User activity retrieved successfully', [
                'user_id' => $query->userId,
                'count' => count($result['data'] ?? [])
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving user activity', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetUserActivityQuery $query): void
    {
        if (empty($query->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
