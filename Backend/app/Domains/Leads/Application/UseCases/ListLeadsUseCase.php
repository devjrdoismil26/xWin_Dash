<?php

namespace App\Domains\Leads\Application\UseCases;

use App\Domains\Leads\Application\Queries\ListLeadsQuery;
use App\Domains\Leads\Application\Handlers\ListLeadsHandler;
use App\Domains\Leads\Application\Services\LeadsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class ListLeadsUseCase
{
    public function __construct(
        private ListLeadsHandler $listLeadsHandler,
        private LeadsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(ListLeadsQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'leads', 'list_leads');

            // Executar query via handler
            $result = $this->listLeadsHandler->handle($query);

            Log::info('Leads listed successfully', [
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Leads listados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error listing leads', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao listar leads: ' . $e->getMessage()
            ];
        }
    }
}
