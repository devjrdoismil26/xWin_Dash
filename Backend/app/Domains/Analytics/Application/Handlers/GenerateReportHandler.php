<?php

namespace App\Domains\Analytics\Application\Handlers;

use App\Domains\Analytics\Application\Commands\GenerateReportCommand;
use App\Domains\Analytics\Domain\Services\ReportService;
use App\Domains\Analytics\Domain\Services\AnalyticsDataService;
use Illuminate\Support\Facades\Log;

class GenerateReportHandler
{
    public function __construct(
        private ReportService $reportService,
        private AnalyticsDataService $analyticsDataService
    ) {
    }

    public function handle(GenerateReportCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Coletar dados analíticos
            $analyticsData = $this->analyticsDataService->collectData([
                'metrics' => $command->metrics,
                'date_from' => $command->dateFrom,
                'date_to' => $command->dateTo,
                'filters' => $command->filters
            ]);

            // Gerar relatório
            $report = $this->reportService->generateReport([
                'report_type' => $command->reportType,
                'data' => $analyticsData,
                'format' => $command->format,
                'parameters' => $command->parameters
            ]);

            Log::info('Report generated successfully', [
                'report_type' => $command->reportType,
                'format' => $command->format
            ]);

            return [
                'report' => $report,
                'message' => 'Relatório gerado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error generating report', [
                'report_type' => $command->reportType,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(GenerateReportCommand $command): void
    {
        if (empty($command->reportType)) {
            throw new \InvalidArgumentException('Tipo de relatório é obrigatório');
        }

        $validFormats = ['json', 'csv', 'pdf', 'xlsx'];
        if (!in_array($command->format, $validFormats)) {
            throw new \InvalidArgumentException('Formato inválido');
        }
    }
}
