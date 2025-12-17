<?php

namespace App\Domains\Leads\Application\Handlers;

use App\Domains\Leads\Application\Commands\UpdateLeadScoreCommand;
use App\Domains\Leads\Domain\Repositories\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Services\LeadService;
use App\Domains\Leads\Domain\Services\LeadScoringService;
use Illuminate\Support\Facades\Log;

class UpdateLeadScoreHandler
{
    public function __construct(
        private LeadRepositoryInterface $leadRepository,
        private LeadService $leadService,
        private LeadScoringService $leadScoringService
    ) {
    }

    public function handle(UpdateLeadScoreCommand $command): array
    {
        try {
            // Buscar o lead existente
            $lead = $this->leadRepository->findById($command->leadId);

            if (!$lead) {
                throw new \Exception('Lead não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Atualizar o score
            $updatedLead = $this->leadService->updateLead($lead, [
                'score' => $command->score,
                'score_updated_at' => now()
            ]);

            // Salvar no repositório
            $savedLead = $this->leadRepository->save($updatedLead);

            // Registrar atividade de score
            $this->leadScoringService->recordScoreActivity($lead, $command->score, $command->reason);

            Log::info('Lead score updated successfully', [
                'lead_id' => $command->leadId,
                'score' => $command->score
            ]);

            return [
                'lead' => $savedLead->toArray(),
                'message' => 'Score do lead atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating lead score', [
                'lead_id' => $command->leadId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateLeadScoreCommand $command): void
    {
        if (empty($command->leadId)) {
            throw new \InvalidArgumentException('ID do lead é obrigatório');
        }

        if ($command->score < 0 || $command->score > 100) {
            throw new \InvalidArgumentException('Score deve estar entre 0 e 100');
        }
    }
}
