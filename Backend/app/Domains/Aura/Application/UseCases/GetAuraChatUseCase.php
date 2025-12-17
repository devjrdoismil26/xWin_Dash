<?php

namespace App\Domains\Aura\Application\UseCases;

use App\Domains\Aura\Application\Queries\GetAuraChatQuery;
use App\Domains\Aura\Application\Handlers\GetAuraChatHandler;
use App\Domains\Aura\Application\Services\AuraApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetAuraChatUseCase
{
    public function __construct(
        private GetAuraChatHandler $getAuraChatHandler,
        private AuraApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetAuraChatQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'aura', 'view_chat');

            // Executar query via handler
            $result = $this->getAuraChatHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Chat Aura não encontrado'
                ];
            }

            Log::info('Aura chat retrieved successfully', [
                'chat_id' => $query->chatId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Chat Aura recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving Aura chat', [
                'chat_id' => $query->chatId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar chat Aura: ' . $e->getMessage()
            ];
        }
    }
}
