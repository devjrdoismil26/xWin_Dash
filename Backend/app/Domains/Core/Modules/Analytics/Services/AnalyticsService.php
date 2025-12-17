<?php

namespace App\Domains\Core\Modules\Analytics\Services;

use App\Domains\Core\Modules\Analytics\Repositories\AnalyticsRepository;

class AnalyticsService
{
    protected AnalyticsRepository $analyticsRepository;

    public function __construct(AnalyticsRepository $analyticsRepository)
    {
        $this->analyticsRepository = $analyticsRepository;
    }

    /**
     * Processa dados analíticos para um tipo de relatório específico.
     *
     * @param string $reportType
     * @param string $startDate
     * @param string $endDate
     * @param array  $filters
     *
     * @return array
     */
    public function getProcessedAnalyticsData(string $reportType, string $startDate, string $endDate, array $filters = []): array
    {
        $rawData = $this->analyticsRepository->getEventData($reportType, $startDate, $endDate, $filters);

        // Lógica de processamento e agregação dos dados brutos
        $processedData = [];
        foreach ($rawData as $dataPoint) {
            // Exemplo simples de agregação
            $processedData[$dataPoint['date']] = ($processedData[$dataPoint['date']] ?? 0) + $dataPoint['value'];
        }

        return $processedData;
    }

    /**
     * Inicia o processo de limpeza de dados analíticos.
     *
     * @param string $period
     * @param string $dataType
     *
     * @return bool
     */
    public function cleanupAnalytics(string $period, string $dataType): bool
    {
        return $this->analyticsRepository->cleanupData($period, $dataType);
    }
}
