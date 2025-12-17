<?php

namespace App\Domains\Leads\Application\UseCases;

use App\Domains\Leads\Application\Commands\ConvertLeadCommand;
use App\Domains\Leads\Application\Handlers\ConvertLeadHandler;
use App\Domains\Leads\Application\Services\LeadsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class ConvertLeadUseCase
{
    public function __construct(
        private ConvertLeadHandler $convertLeadHandler,
        private LeadsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(ConvertLeadCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateLeadConversion($command->toArray());

            // Executar comando via handler
            $result = $this->convertLeadHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('lead.converted', [
                'lead_id' => $command->leadId,
                'conversion_type' => $command->conversionType,
                'converted_to_id' => $command->convertedToId
            ]);

            Log::info('Lead converted successfully', [
                'lead_id' => $command->leadId,
                'conversion_type' => $command->conversionType
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Lead convertido com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error converting lead', [
                'lead_id' => $command->leadId,
                'conversion_type' => $command->conversionType,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao converter lead: ' . $e->getMessage()
            ];
        }
    }
}
