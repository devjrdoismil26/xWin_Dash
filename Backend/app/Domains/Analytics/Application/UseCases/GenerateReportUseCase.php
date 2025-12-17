<?php

namespace App\Domains\Analytics\Application\UseCases;

use App\Domains\Analytics\Application\Commands\GenerateReportCommand;
use App\Domains\Analytics\Application\Handlers\GenerateReportHandler;
use App\Domains\Analytics\Application\Services\AnalyticsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class GenerateReportUseCase
{
    public function __construct(
        private GenerateReportHandler $generateReportHandler,
        private AnalyticsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(GenerateReportCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAnalyticsRules($command->toArray());

            // Executar comando via handler
            $result = $this->generateReportHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('analytics.report_generated', [
                'report_type' => $command->reportType,
                'format' => $command->format
            ]);

            Log::info('Analytics report generated successfully', [
                'report_type' => $command->reportType,
                'format' => $command->format
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Relatório gerado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error generating analytics report', [
                'report_type' => $command->reportType,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao gerar relatório: ' . $e->getMessage()
            ];
        }
    }
}
