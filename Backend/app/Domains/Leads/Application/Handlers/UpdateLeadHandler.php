<?php

namespace App\Domains\Leads\Application\Handlers;

use App\Domains\Leads\Application\Commands\UpdateLeadCommand;
use App\Domains\Leads\Domain\Repositories\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Services\LeadService;
use App\Domains\Leads\Domain\Services\LeadScoringService;
use Illuminate\Support\Facades\Log;

class UpdateLeadHandler
{
    public function __construct(
        private LeadRepositoryInterface $leadRepository,
        private LeadService $leadService,
        private LeadScoringService $leadScoringService
    ) {
    }

    public function handle(UpdateLeadCommand $command): array
    {
        try {
            // Buscar o lead existente
            $lead = $this->leadRepository->findById($command->leadId);

            if (!$lead) {
                throw new \Exception('Lead não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se o email já existe (se foi alterado)
            if ($command->email && $command->email !== $lead->email) {
                $existingLead = $this->leadRepository->findByEmail($command->email);
                if ($existingLead) {
                    throw new \Exception('Email já está em uso por outro lead');
                }
            }

            // Atualizar o lead
            $updateData = array_filter([
                'name' => $command->name,
                'email' => $command->email,
                'phone' => $command->phone,
                'company' => $command->company,
                'position' => $command->position,
                'source' => $command->source,
                'status' => $command->status,
                'score' => $command->score,
                'custom_fields' => $command->customFields,
                'tags' => $command->tags,
                'assigned_to' => $command->assignedTo,
                'notes' => $command->notes
            ], function ($value) {
                return $value !== null;
            });

            $updatedLead = $this->leadService->updateLead($lead, $updateData);

            // Recalcular score se dados relevantes foram alterados
            if (isset($updateData['name']) || isset($updateData['company']) || isset($updateData['position'])) {
                $newScore = $this->leadScoringService->calculateScore($updatedLead);
                $updatedLead->score = $newScore;
            }

            // Salvar no repositório
            $savedLead = $this->leadRepository->save($updatedLead);

            // Registrar atividade de atualização
            $this->leadService->logActivity($savedLead, 'updated', 'Lead atualizado');

            Log::info('Lead updated successfully', [
                'lead_id' => $command->leadId
            ]);

            return [
                'lead' => $savedLead->toArray(),
                'message' => 'Lead atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating lead', [
                'lead_id' => $command->leadId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateLeadCommand $command): void
    {
        if (empty($command->leadId)) {
            throw new \InvalidArgumentException('ID do lead é obrigatório');
        }

        if ($command->email && !filter_var($command->email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email inválido');
        }
    }
}
