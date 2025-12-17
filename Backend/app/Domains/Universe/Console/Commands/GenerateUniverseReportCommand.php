<?php

namespace App\Domains\Universe\Console\Commands;

use App\Domains\Universe\Services\BusinessIntelligenceEngine;
use App\Domains\Universe\Services\UniversalExportService;
use Illuminate\Console\Command; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

// Supondo que este serviço exista

class GenerateUniverseReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'universe:generate-report {--type= : The type of report to generate (e.g., usage, ai_performance)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generates a report for the Universe module.';

    protected BusinessIntelligenceEngine $biEngine;

    protected UniversalExportService $exportService;

    public function __construct(BusinessIntelligenceEngine $biEngine, UniversalExportService $exportService)
    {
        parent::__construct();
        $this->biEngine = $biEngine;
        $this->exportService = $exportService;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $reportType = $this->option('type');

        if (!is_string($reportType) || $reportType === '') {
            $this->error('Please specify a valid report type using --type option.');
            return Command::FAILURE;
        }

        $this->info("Generating '{$reportType}' report for the Universe module...");

        try {
            $insights = $this->biEngine->getInsights($reportType); // Obter insights do BI Engine

            // Exemplo de exportação para CSV
            $filePath = $this->exportService->export(
                "universe_{$reportType}_report",
                'csv',
                $insights, // Passar os insights como dados para exportação
            );

            $this->info("Report '{$reportType}' generated successfully at: {$filePath}");
            Log::info("Universe report '{$reportType}' generated.");

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error generating Universe report: ' . $e->getMessage());
            Log::error("Universe report generation failed: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
