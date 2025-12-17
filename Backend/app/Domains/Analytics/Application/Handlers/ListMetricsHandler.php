<?php

namespace App\Domains\Analytics\Application\Handlers;

use App\Domains\Analytics\Application\Queries\ListMetricsQuery;
use App\Domains\Analytics\Domain\Repositories\MetricRepositoryInterface;
use Illuminate\Support\Facades\Log;

class ListMetricsHandler
{
    public function __construct(
        private MetricRepositoryInterface $metricRepository
    ) {
    }

    public function handle(ListMetricsQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'search' => $query->search,
                'type' => $query->type,
                'category' => $query->category,
                'is_active' => $query->isActive,
                'tags' => $query->tags
            ];

            // Remover filtros vazios
            $filters = array_filter($filters, function ($value) {
                return $value !== null && $value !== '';
            });

            // Preparar opções de paginação
            $paginationOptions = [
                'page' => $query->page ?? 1,
                'per_page' => $query->perPage ?? 15,
                'sort_by' => $query->sortBy ?? 'created_at',
                'sort_direction' => $query->sortDirection ?? 'desc'
            ];

            // Buscar métricas
            $result = $this->metricRepository->findByFilters($filters, $paginationOptions);

            Log::info('Metrics listed successfully', [
                'count' => count($result['data']),
                'filters' => $filters
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error listing metrics', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(ListMetricsQuery $query): void
    {
        // Query de listagem não precisa de validações específicas
    }
}
