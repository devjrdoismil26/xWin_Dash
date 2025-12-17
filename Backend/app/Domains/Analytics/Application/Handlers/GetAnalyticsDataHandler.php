<?php

namespace App\Domains\Analytics\Application\Handlers;

use App\Domains\Analytics\Application\Queries\GetAnalyticsDataQuery;
use App\Domains\Analytics\Domain\Services\AnalyticsDataService;
use Illuminate\Support\Facades\Log;

class GetAnalyticsDataHandler
{
    public function __construct(
        private AnalyticsDataService $analyticsDataService
    ) {
    }

    public function handle(GetAnalyticsDataQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Coletar dados analíticos
            $data = $this->analyticsDataService->getAnalyticsData([
                'metrics' => $query->metrics,
                'date_from' => $query->dateFrom,
                'date_to' => $query->dateTo,
                'filters' => $query->filters,
                'group_by' => $query->groupBy,
                'aggregation' => $query->aggregation
            ]);

            Log::info('Analytics data retrieved successfully', [
                'metrics_count' => count($query->metrics)
            ]);

            return [
                'data' => $data,
                'message' => 'Dados analíticos recuperados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving analytics data', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetAnalyticsDataQuery $query): void
    {
        if (empty($query->metrics)) {
            throw new \InvalidArgumentException('Métricas são obrigatórias');
        }

        if (!is_array($query->metrics)) {
            throw new \InvalidArgumentException('Métricas devem ser um array');
        }
    }
}
