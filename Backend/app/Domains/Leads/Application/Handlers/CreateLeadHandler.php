<?php

namespace App\Domains\Leads\Application\Handlers;

use App\Domains\Leads\Application\Commands\CreateLeadCommand;
use App\Domains\Leads\Domain\Repositories\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Services\LeadService;
use App\Domains\Leads\Domain\Services\LeadScoringService;
use Illuminate\Support\Facades\Log;

class CreateLeadHandler
{
    public function __construct(
        private LeadRepositoryInterface $leadRepository,
        private LeadService $leadService,
        private LeadScoringService $leadScoringService
    ) {
    }

    public function handle(CreateLeadCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se o lead já existe (por email)
            $existingLead = $this->leadRepository->findByEmail($command->email);
            if ($existingLead) {
                throw new \Exception('Lead com este email já existe');
            }

            // Criar o lead no domínio
            $lead = $this->leadService->createLead([
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
            ]);

            // Calcular score inicial se não fornecido
            if ($command->score === null || $command->score === 0) {
                $calculatedScore = $this->leadScoringService->calculateScore($lead);
                $lead->score = $calculatedScore;
            }

            // Salvar no repositório
            $savedLead = $this->leadRepository->save($lead);

            // Registrar atividade de criação
            $this->leadService->logActivity($savedLead, 'created', 'Lead criado');

            Log::info('Lead created successfully', [
                'lead_id' => $savedLead->id,
                'email' => $command->email
            ]);

            return [
                'lead' => $savedLead->toArray(),
                'message' => 'Lead criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating lead', [
                'email' => $command->email,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateLeadCommand $command): void
    {
        if (empty($command->name)) {
            throw new \InvalidArgumentException('Nome é obrigatório');
        }

        if (empty($command->email)) {
            throw new \InvalidArgumentException('Email é obrigatório');
        }

        if (!filter_var($command->email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email inválido');
        }
    }
}
