<?php

namespace App\Domains\Analytics\Application\Handlers;

use App\Domains\Analytics\Application\Queries\GetMetricQuery;
use App\Domains\Analytics\Domain\Repositories\MetricRepositoryInterface;
use App\Domains\Analytics\Domain\Services\MetricService;
use Illuminate\Support\Facades\Log;

class GetMetricHandler
{
    public function __construct(
        private MetricRepositoryInterface $metricRepository,
        private MetricService $metricService
    ) {
    }

    public function handle(GetMetricQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar a métrica
            $metric = $this->metricRepository->findById($query->metricId);

            if (!$metric) {
                return null;
            }

            // Enriquecer com dados se solicitado
            $result = $metric->toArray();

            if ($query->includeData) {
                $result['data'] = $this->metricService->getMetricData(
                    $metric,
                    $query->dateFrom,
                    $query->dateTo
                );
            }

            Log::info('Metric retrieved successfully', [
                'metric_id' => $query->metricId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving metric', [
                'metric_id' => $query->metricId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetMetricQuery $query): void
    {
        if (empty($query->metricId)) {
            throw new \InvalidArgumentException('ID da métrica é obrigatório');
        }
    }
}
