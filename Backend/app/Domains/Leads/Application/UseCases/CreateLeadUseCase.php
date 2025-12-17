<?php

namespace App\Domains\Leads\Application\UseCases;

use App\Domains\Leads\Application\Commands\CreateLeadCommand;
use App\Domains\Leads\Application\Handlers\CreateLeadHandler;
use App\Domains\Leads\Application\Services\LeadsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class CreateLeadUseCase
{
    public function __construct(
        private CreateLeadHandler $createLeadHandler,
        private LeadsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(CreateLeadCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateLeadCreation($command->toArray());

            // Executar comando via handler
            $result = $this->createLeadHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('lead.created', [
                'lead_id' => $result['lead']['id'],
                'email' => $command->email,
                'source' => $command->source
            ]);

            Log::info('Lead created successfully', [
                'lead_id' => $result['lead']['id'],
                'email' => $command->email
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Lead criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating lead', [
                'email' => $command->email,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao criar lead: ' . $e->getMessage()
            ];
        }
    }
}
