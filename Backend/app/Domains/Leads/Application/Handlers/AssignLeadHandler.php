<?php

namespace App\Domains\Leads\Application\Handlers;

use App\Domains\Leads\Application\Commands\AssignLeadCommand;
use App\Domains\Leads\Domain\Repositories\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Services\LeadService;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Log;

class AssignLeadHandler
{
    public function __construct(
        private LeadRepositoryInterface $leadRepository,
        private LeadService $leadService,
        private UserRepositoryInterface $userRepository
    ) {
    }

    public function handle(AssignLeadCommand $command): array
    {
        try {
            // Buscar o lead existente
            $lead = $this->leadRepository->findById($command->leadId);

            if (!$lead) {
                throw new \Exception('Lead não encontrado');
            }

            // Verificar se o usuário existe
            $user = $this->userRepository->findById($command->assignedTo);
            if (!$user) {
                throw new \Exception('Usuário não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Atualizar atribuição
            $updatedLead = $this->leadService->assignLead($lead, $command->assignedTo);

            // Salvar no repositório
            $savedLead = $this->leadRepository->save($updatedLead);

            // Registrar atividade de atribuição
            $this->leadService->logActivity(
                $savedLead,
                'assigned',
                "Lead atribuído para {$user->name}",
                $command->notes
            );

            Log::info('Lead assigned successfully', [
                'lead_id' => $command->leadId,
                'assigned_to' => $command->assignedTo
            ]);

            return [
                'lead' => $savedLead->toArray(),
                'assigned_user' => $user->toArray(),
                'message' => 'Lead atribuído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error assigning lead', [
                'lead_id' => $command->leadId,
                'assigned_to' => $command->assignedTo,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(AssignLeadCommand $command): void
    {
        if (empty($command->leadId)) {
            throw new \InvalidArgumentException('ID do lead é obrigatório');
        }

        if (empty($command->assignedTo)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
