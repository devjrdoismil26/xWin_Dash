<?php

namespace App\Application\Analytics\UseCases;

use App\Application\Analytics\Commands\GenerateAnalyticsReportCommand;
use App\Domains\Analytics\Services\AnalyticsService;
use App\Domains\Analytics\Domain\AnalyticReport;
use App\Shared\Exceptions\BusinessRuleException;
use Illuminate\Support\Facades\Log;

class GenerateAnalyticsReportUseCase
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Executa o caso de uso para gerar um relatório de analytics.
     *
     * @param GenerateAnalyticsReportCommand $command
     * @return AnalyticReport
     * @throws BusinessRuleException
     */
    public function execute(GenerateAnalyticsReportCommand $command): AnalyticReport
    {
        // Validate date range
        $this->validateDateRange($command->startDate, $command->endDate);

        // Validate report type
        $this->validateReportType($command->reportType);

        try {
            // Generate the report
            $report = $this->analyticsService->generateReport(
                $command->reportType,
                $command->startDate,
                $command->endDate,
                $command->filters
            );

            Log::info("Analytics report generated for user {$command->userId}, type: {$command->reportType}");

            return $report;

        } catch (\Exception $e) {
            Log::error("Failed to generate analytics report: {$e->getMessage()}");
            throw new BusinessRuleException("Failed to generate analytics report: {$e->getMessage()}");
        }
    }

    /**
     * Valida o intervalo de datas.
     *
     * @param string $startDate
     * @param string $endDate
     * @throws BusinessRuleException
     */
    private function validateDateRange(string $startDate, string $endDate): void
    {
        $start = new \DateTime($startDate);
        $end = new \DateTime($endDate);
        $now = new \DateTime();

        if ($start > $end) {
            throw new BusinessRuleException('Start date cannot be after end date');
        }

        if ($start > $now) {
            throw new BusinessRuleException('Start date cannot be in the future');
        }

        if ($end > $now) {
            throw new BusinessRuleException('End date cannot be in the future');
        }

        // Check if date range is not too large (max 1 year)
        $diff = $start->diff($end);
        if ($diff->days > 365) {
            throw new BusinessRuleException('Date range cannot exceed 1 year');
        }
    }

    /**
     * Valida o tipo de relatório.
     *
     * @param string $reportType
     * @throws BusinessRuleException
     */
    private function validateReportType(string $reportType): void
    {
        $validTypes = [
            'traffic',
            'conversions',
            'revenue',
            'ads_performance',
            'social_media',
            'email_marketing',
            'custom',
        ];

        if (!in_array($reportType, $validTypes)) {
            throw new BusinessRuleException("Invalid report type: {$reportType}");
        }
    }
}