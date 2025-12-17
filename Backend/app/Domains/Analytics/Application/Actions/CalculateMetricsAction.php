<?php

namespace App\Domains\Analytics\Application\Actions;

use App\Domains\Analytics\Application\DTOs\MetricDTO;
use App\Domains\Analytics\Application\Services\MetricsService;

class CalculateMetricsAction
{
    public function __construct(
        private readonly MetricsService $metricsService
    ) {
    }

    public function execute(MetricDTO $dto): array
    {
        return $this->metricsService->calculateMetric($dto);
    }

    public function executeForPeriod(string $period, ?string $userId = null): array
    {
        return $this->metricsService->getMetricsByPeriod($period, $userId)->toArray();
    }
}
