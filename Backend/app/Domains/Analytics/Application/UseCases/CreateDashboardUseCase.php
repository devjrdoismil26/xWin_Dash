<?php

namespace App\Domains\Analytics\Application\UseCases;

use App\Domains\Analytics\Application\Commands\CreateDashboardCommand;
use App\Domains\Analytics\Application\Handlers\CreateDashboardHandler;
use App\Domains\Analytics\Application\Services\AnalyticsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class CreateDashboardUseCase
{
    public function __construct(
        private CreateDashboardHandler $createDashboardHandler,
        private AnalyticsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(CreateDashboardCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAnalyticsRules($command->toArray());

            // Executar comando via handler
            $result = $this->createDashboardHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('analytics.dashboard_created', [
                'dashboard_id' => $result['dashboard']['id'],
                'name' => $command->name
            ]);

            Log::info('Analytics dashboard created successfully', [
                'dashboard_id' => $result['dashboard']['id'],
                'name' => $command->name
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Dashboard criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating analytics dashboard', [
                'name' => $command->name,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao criar dashboard: ' . $e->getMessage()
            ];
        }
    }
}
