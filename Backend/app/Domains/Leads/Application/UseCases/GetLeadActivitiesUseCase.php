<?php

namespace App\Domains\Leads\Application\UseCases;

use App\Domains\Leads\Application\Queries\GetLeadActivitiesQuery;
use App\Domains\Leads\Application\Handlers\GetLeadActivitiesHandler;
use App\Domains\Leads\Application\Services\LeadsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetLeadActivitiesUseCase
{
    public function __construct(
        private GetLeadActivitiesHandler $getLeadActivitiesHandler,
        private LeadsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetLeadActivitiesQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'leads', 'view_lead_activities');

            // Executar query via handler
            $result = $this->getLeadActivitiesHandler->handle($query);

            Log::info('Lead activities retrieved successfully', [
                'lead_id' => $query->leadId,
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Atividades do lead recuperadas com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving lead activities', [
                'lead_id' => $query->leadId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar atividades do lead: ' . $e->getMessage()
            ];
        }
    }
}
