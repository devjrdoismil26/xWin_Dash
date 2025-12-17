<?php

namespace App\Domains\Leads\Application\UseCases;

use App\Domains\Leads\Application\Queries\GetLeadByEmailQuery;
use App\Domains\Leads\Application\Handlers\GetLeadByEmailHandler;
use App\Domains\Leads\Application\Services\LeadsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetLeadByEmailUseCase
{
    public function __construct(
        private GetLeadByEmailHandler $getLeadByEmailHandler,
        private LeadsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetLeadByEmailQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'leads', 'view_lead_by_email');

            // Executar query via handler
            $result = $this->getLeadByEmailHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Lead não encontrado'
                ];
            }

            Log::info('Lead retrieved by email successfully', [
                'email' => $query->email
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Lead recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving lead by email', [
                'email' => $query->email,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar lead: ' . $e->getMessage()
            ];
        }
    }
}
