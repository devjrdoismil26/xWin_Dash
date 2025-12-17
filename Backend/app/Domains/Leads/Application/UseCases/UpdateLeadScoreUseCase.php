<?php

namespace App\Domains\Leads\Application\UseCases;

use App\Domains\Leads\Application\Commands\UpdateLeadScoreCommand;
use App\Domains\Leads\Application\Handlers\UpdateLeadScoreHandler;
use App\Domains\Leads\Application\Services\LeadsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class UpdateLeadScoreUseCase
{
    public function __construct(
        private UpdateLeadScoreHandler $updateLeadScoreHandler,
        private LeadsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(UpdateLeadScoreCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateLeadScoring($command->toArray());

            // Executar comando via handler
            $result = $this->updateLeadScoreHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('lead.score_updated', [
                'lead_id' => $command->leadId,
                'score' => $command->score,
                'reason' => $command->reason
            ]);

            Log::info('Lead score updated successfully', [
                'lead_id' => $command->leadId,
                'score' => $command->score
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Score do lead atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating lead score', [
                'lead_id' => $command->leadId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atualizar score do lead: ' . $e->getMessage()
            ];
        }
    }
}
