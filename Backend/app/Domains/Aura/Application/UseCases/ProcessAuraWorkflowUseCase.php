<?php

namespace App\Domains\Aura\Application\UseCases;

use App\Domains\Aura\Application\Commands\ProcessAuraWorkflowCommand;
use App\Domains\Aura\Application\Handlers\ProcessAuraWorkflowHandler;
use App\Domains\Aura\Application\Services\AuraApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class ProcessAuraWorkflowUseCase
{
    public function __construct(
        private ProcessAuraWorkflowHandler $processAuraWorkflowHandler,
        private AuraApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(ProcessAuraWorkflowCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAuraRules($command->toArray());

            // Executar comando via handler
            $result = $this->processAuraWorkflowHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('aura.workflow_processed', [
                'workflow_type' => $command->workflowType,
                'trigger' => $command->trigger
            ]);

            Log::info('Aura workflow processed successfully', [
                'workflow_type' => $command->workflowType,
                'trigger' => $command->trigger
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Workflow processado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error processing Aura workflow', [
                'workflow_type' => $command->workflowType,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao processar workflow: ' . $e->getMessage()
            ];
        }
    }
}
