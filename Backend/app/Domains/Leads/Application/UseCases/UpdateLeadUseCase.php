<?php

namespace App\Domains\Leads\Application\UseCases;

use App\Domains\Leads\Application\Commands\UpdateLeadCommand;
use App\Domains\Leads\Application\Handlers\UpdateLeadHandler;
use App\Domains\Leads\Application\Services\LeadsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class UpdateLeadUseCase
{
    public function __construct(
        private UpdateLeadHandler $updateLeadHandler,
        private LeadsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(UpdateLeadCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateLeadUpdate($command->toArray());

            // Executar comando via handler
            $result = $this->updateLeadHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('lead.updated', [
                'lead_id' => $command->leadId,
                'changes' => $command->toArray()
            ]);

            Log::info('Lead updated successfully', [
                'lead_id' => $command->leadId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Lead atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating lead', [
                'lead_id' => $command->leadId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atualizar lead: ' . $e->getMessage()
            ];
        }
    }
}
