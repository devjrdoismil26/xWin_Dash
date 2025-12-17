<?php

namespace App\Domains\Core\Modules\Analytics\Services;

class ReportService
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Gera um relatório formatado com base no tipo e nos parâmetros.
     *
     * @param string $reportType
     * @param string $startDate
     * @param string $endDate
     * @param array<string, mixed>  $filters
     *
     * @return array<string, mixed>
     */
    public function generateReport(string $reportType, string $startDate, string $endDate, array $filters = []): array
    {
        $processedData = $this->analyticsService->getProcessedAnalyticsData($reportType, $startDate, $endDate, $filters);

        // Lógica para formatar os dados processados em um relatório específico
        $report = [
            'report_type' => $reportType,
            'period' => "{$startDate} to {$endDate}",
            'filters_applied' => $filters,
            'data' => $processedData,
            'summary' => $this->generateSummary($processedData),
        ];

        return $report;
    }

    /**
     * Gera um resumo para os dados do relatório.
     *
     * @param array<mixed> $data
     *
     * @return array<string, int|float>
     */
    protected function generateSummary(array $data): array
    {
        if (empty($data)) {
            return ['total' => 0, 'average' => 0];
        }
        $total = array_sum($data);
        $average = $total / count($data);
        return ['total' => $total, 'average' => $average];
    }
}
