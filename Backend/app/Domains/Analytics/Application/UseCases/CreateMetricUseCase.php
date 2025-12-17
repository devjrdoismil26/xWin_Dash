<?php

namespace App\Domains\Analytics\Application\UseCases;

use App\Domains\Analytics\Application\Commands\CreateMetricCommand;
use App\Domains\Analytics\Application\Handlers\CreateMetricHandler;
use App\Domains\Analytics\Application\Services\AnalyticsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class CreateMetricUseCase
{
    public function __construct(
        private CreateMetricHandler $createMetricHandler,
        private AnalyticsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(CreateMetricCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAnalyticsRules($command->toArray());

            // Executar comando via handler
            $result = $this->createMetricHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('analytics.metric_created', [
                'metric_id' => $result['metric']['id'],
                'name' => $command->name,
                'type' => $command->type
            ]);

            Log::info('Analytics metric created successfully', [
                'metric_id' => $result['metric']['id'],
                'name' => $command->name
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Métrica criada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating analytics metric', [
                'name' => $command->name,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao criar métrica: ' . $e->getMessage()
            ];
        }
    }
}
