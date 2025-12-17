<?php

namespace App\Domains\Analytics\Application\UseCases;

use App\Domains\Analytics\Application\Commands\DeleteMetricCommand;
use App\Domains\Analytics\Application\Handlers\DeleteMetricHandler;
use App\Domains\Analytics\Application\Services\AnalyticsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class DeleteMetricUseCase
{
    public function __construct(
        private DeleteMetricHandler $deleteMetricHandler,
        private AnalyticsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(DeleteMetricCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAnalyticsRules($command->toArray());

            // Executar comando via handler
            $result = $this->deleteMetricHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('analytics.metric_deleted', [
                'metric_id' => $command->metricId,
                'force_delete' => $command->forceDelete
            ]);

            Log::info('Analytics metric deleted successfully', [
                'metric_id' => $command->metricId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Métrica excluída com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting analytics metric', [
                'metric_id' => $command->metricId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao excluir métrica: ' . $e->getMessage()
            ];
        }
    }
}
