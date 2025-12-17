<?php

namespace App\Domains\Leads\Application\UseCases;

use App\Domains\Leads\Application\Commands\AssignLeadCommand;
use App\Domains\Leads\Application\Handlers\AssignLeadHandler;
use App\Domains\Leads\Application\Services\LeadsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class AssignLeadUseCase
{
    public function __construct(
        private AssignLeadHandler $assignLeadHandler,
        private LeadsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(AssignLeadCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateLeadAssignment($command->toArray());

            // Executar comando via handler
            $result = $this->assignLeadHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('lead.assigned', [
                'lead_id' => $command->leadId,
                'assigned_to' => $command->assignedTo
            ]);

            Log::info('Lead assigned successfully', [
                'lead_id' => $command->leadId,
                'assigned_to' => $command->assignedTo
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Lead atribuído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error assigning lead', [
                'lead_id' => $command->leadId,
                'assigned_to' => $command->assignedTo,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atribuir lead: ' . $e->getMessage()
            ];
        }
    }
}
