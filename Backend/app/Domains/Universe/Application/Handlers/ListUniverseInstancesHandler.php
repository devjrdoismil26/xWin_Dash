<?php

namespace App\Domains\Universe\Application\Handlers;

use App\Domains\Universe\Application\Queries\ListUniverseInstancesQuery;
use App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface;
use App\Domains\Universe\Domain\Services\UniverseInstanceService;
use App\Domains\Universe\Domain\Services\UniverseAnalyticsService;
use Illuminate\Support\Facades\Log;

class ListUniverseInstancesHandler
{
    public function __construct(
        private UniverseInstanceRepositoryInterface $universeInstanceRepository,
        private UniverseInstanceService $universeInstanceService,
        private UniverseAnalyticsService $analyticsService
    ) {
    }

    public function handle(ListUniverseInstancesQuery $query): array
    {
        try {
            // Preparar filtros
            $filters = [
                'user_id' => $query->userId,
                'template_id' => $query->templateId,
                'is_active' => $query->isActive,
                'tags' => $query->tags,
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
                'per_page' => $query->perPage ?? 15,
                'sort_by' => $query->sortBy ?? 'created_at',
                'sort_direction' => $query->sortDirection ?? 'desc'
            ];

            // Buscar instâncias
            $result = $this->universeInstanceRepository->findByFilters($filters, $paginationOptions);

            // Enriquecer dados se solicitado
            if ($query->includeAnalytics || $query->includePerformance || $query->includeTemplate) {
                foreach ($result['data'] as &$instance) {
                    if ($query->includeAnalytics) {
                        $instance['analytics'] = $this->analyticsService->getInstanceAnalytics($instance);
                    }
                    if ($query->includePerformance) {
                        $instance['performance'] = $this->analyticsService->getInstancePerformance($instance);
                    }
                    if ($query->includeTemplate) {
                        $instance['template'] = $this->universeInstanceService->getInstanceTemplate($instance);
                    }
                }
            }

            Log::info('Universe instances listed successfully', [
                'user_id' => $query->userId,
                'count' => count($result['data']),
                'filters' => $filters
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error listing universe instances', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
