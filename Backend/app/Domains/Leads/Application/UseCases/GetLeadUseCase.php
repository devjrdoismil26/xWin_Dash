<?php

namespace App\Domains\Leads\Application\UseCases;

use App\Domains\Leads\Application\Queries\GetLeadQuery;
use App\Domains\Leads\Application\Handlers\GetLeadHandler;
use App\Domains\Leads\Application\Services\LeadsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetLeadUseCase
{
    public function __construct(
        private GetLeadHandler $getLeadHandler,
        private LeadsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetLeadQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'leads', 'view_lead');

            // Executar query via handler
            $result = $this->getLeadHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Lead não encontrado'
                ];
            }

            Log::info('Lead retrieved successfully', [
                'lead_id' => $query->leadId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Lead recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving lead', [
                'lead_id' => $query->leadId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar lead: ' . $e->getMessage()
            ];
        }
    }
}
