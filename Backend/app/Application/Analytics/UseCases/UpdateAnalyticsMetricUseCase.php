<?php

namespace App\Application\Analytics\UseCases;

use App\Application\Analytics\Commands\UpdateAnalyticsMetricCommand;
use App\Domains\Analytics\Services\AnalyticsService;
use App\Domains\Analytics\Domain\AnalyticsMetric;
use App\Shared\Exceptions\BusinessRuleException;
use Illuminate\Support\Facades\Log;

class UpdateAnalyticsMetricUseCase
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Executa o caso de uso para atualizar uma métrica de analytics.
     *
     * @param UpdateAnalyticsMetricCommand $command
     * @return AnalyticsMetric
     * @throws BusinessRuleException
     */
    public function execute(UpdateAnalyticsMetricCommand $command): AnalyticsMetric
    {
        $metric = $this->analyticsService->getMetricById($command->metricId);
        
        if (!$metric) {
            throw new BusinessRuleException('Analytics metric not found');
        }

        // Validate the update
        $this->validateMetricUpdate($metric, $command);

        try {
            // Update the metric
            $updatedMetric = $this->analyticsService->updateMetric($command->metricId, [
                'value' => $command->newValue,
                'metadata' => $command->metadata,
                'updated_at' => new \DateTime(),
            ]);

            Log::info("Analytics metric {$command->metricId} updated successfully");

            return $updatedMetric;

        } catch (\Exception $e) {
            Log::error("Failed to update analytics metric {$command->metricId}: {$e->getMessage()}");
            throw new BusinessRuleException("Failed to update analytics metric: {$e->getMessage()}");
        }
    }

    /**
     * Valida a atualização da métrica.
     *
     * @param AnalyticsMetric $metric
     * @param UpdateAnalyticsMetricCommand $command
     * @throws BusinessRuleException
     */
    private function validateMetricUpdate(AnalyticsMetric $metric, UpdateAnalyticsMetricCommand $command): void
    {
        // Check if metric can be updated
        if ($metric->date > new \DateTime()) {
            throw new BusinessRuleException('Cannot update metrics for future dates');
        }

        // Check if metric is too old to update (max 30 days)
        $daysSinceMetric = (new \DateTime())->diff($metric->date)->days;
        if ($daysSinceMetric > 30) {
            throw new BusinessRuleException('Cannot update metrics older than 30 days');
        }

        // Validate new value
        if ($command->newValue < 0) {
            throw new BusinessRuleException('Metric value cannot be negative');
        }

        // Check for significant changes that might indicate data corruption
        $changePercentage = abs($command->newValue - $metric->value) / max($metric->value, 1) * 100;
        if ($changePercentage > 1000) { // More than 1000% change
            throw new BusinessRuleException('Metric value change is too large and might indicate data corruption');
        }
    }
}