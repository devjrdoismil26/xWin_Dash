<?php

namespace App\Domains\Aura\Application\UseCases;

use App\Domains\Aura\Application\Queries\ListAuraChatsQuery;
use App\Domains\Aura\Application\Handlers\ListAuraChatsHandler;
use App\Domains\Aura\Application\Services\AuraApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class ListAuraChatsUseCase
{
    public function __construct(
        private ListAuraChatsHandler $listAuraChatsHandler,
        private AuraApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(ListAuraChatsQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'aura', 'list_chats');

            // Executar query via handler
            $result = $this->listAuraChatsHandler->handle($query);

            Log::info('Aura chats listed successfully', [
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Chats Aura listados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error listing Aura chats', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao listar chats Aura: ' . $e->getMessage()
            ];
        }
    }
}
