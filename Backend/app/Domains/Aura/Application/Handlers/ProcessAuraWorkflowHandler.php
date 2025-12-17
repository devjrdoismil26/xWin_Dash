<?php

namespace App\Domains\Aura\Application\Handlers;

use App\Domains\Aura\Application\Commands\ProcessAuraWorkflowCommand;
use App\Domains\Aura\Domain\Services\AuraWorkflowService;
use App\Domains\Aura\Domain\Services\AuraAutomationService;
use Illuminate\Support\Facades\Log;

class ProcessAuraWorkflowHandler
{
    public function __construct(
        private AuraWorkflowService $auraWorkflowService,
        private AuraAutomationService $auraAutomationService
    ) {
    }

    public function handle(ProcessAuraWorkflowCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Processar workflow
            $result = $this->auraWorkflowService->processWorkflow([
                'workflow_type' => $command->workflowType,
                'data' => $command->data,
                'trigger' => $command->trigger,
                'context' => $command->context,
                'parameters' => $command->parameters
            ]);

            // Executar automações se necessário
            if ($result['automations']) {
                $this->auraAutomationService->executeAutomations($result['automations']);
            }

            Log::info('Aura workflow processed successfully', [
                'workflow_type' => $command->workflowType,
                'trigger' => $command->trigger
            ]);

            return [
                'workflow_result' => $result,
                'message' => 'Workflow processado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error processing Aura workflow', [
                'workflow_type' => $command->workflowType,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(ProcessAuraWorkflowCommand $command): void
    {
        if (empty($command->workflowType)) {
            throw new \InvalidArgumentException('Tipo de workflow é obrigatório');
        }

        if (empty($command->data)) {
            throw new \InvalidArgumentException('Dados são obrigatórios');
        }

        if (!is_array($command->data)) {
            throw new \InvalidArgumentException('Dados devem ser um array');
        }
    }
}
