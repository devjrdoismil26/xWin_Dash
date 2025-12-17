<?php

namespace App\Domains\Analytics\Application\UseCases;

use App\Domains\Analytics\Application\Commands\UpdateMetricCommand;
use App\Domains\Analytics\Application\Handlers\UpdateMetricHandler;
use App\Domains\Analytics\Application\Services\AnalyticsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class UpdateMetricUseCase
{
    public function __construct(
        private UpdateMetricHandler $updateMetricHandler,
        private AnalyticsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(UpdateMetricCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAnalyticsRules($command->toArray());

            // Executar comando via handler
            $result = $this->updateMetricHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('analytics.metric_updated', [
                'metric_id' => $command->metricId,
                'changes' => $command->toArray()
            ]);

            Log::info('Analytics metric updated successfully', [
                'metric_id' => $command->metricId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Métrica atualizada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating analytics metric', [
                'metric_id' => $command->metricId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atualizar métrica: ' . $e->getMessage()
            ];
        }
    }
}
