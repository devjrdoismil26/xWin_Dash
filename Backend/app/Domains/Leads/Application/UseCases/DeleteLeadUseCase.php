<?php

namespace App\Domains\Leads\Application\UseCases;

use App\Domains\Leads\Application\Commands\DeleteLeadCommand;
use App\Domains\Leads\Application\Handlers\DeleteLeadHandler;
use App\Domains\Leads\Application\Services\LeadsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class DeleteLeadUseCase
{
    public function __construct(
        private DeleteLeadHandler $deleteLeadHandler,
        private LeadsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(DeleteLeadCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateLeadDeletion($command->toArray());

            // Executar comando via handler
            $result = $this->deleteLeadHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('lead.deleted', [
                'lead_id' => $command->leadId,
                'force_delete' => $command->forceDelete
            ]);

            Log::info('Lead deleted successfully', [
                'lead_id' => $command->leadId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Lead excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting lead', [
                'lead_id' => $command->leadId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao excluir lead: ' . $e->getMessage()
            ];
        }
    }
}
