<?php

namespace App\Domains\Aura\Application\UseCases;

use App\Domains\Aura\Application\Queries\GetAuraMessagesQuery;
use App\Domains\Aura\Application\Handlers\GetAuraMessagesHandler;
use App\Domains\Aura\Application\Services\AuraApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetAuraMessagesUseCase
{
    public function __construct(
        private GetAuraMessagesHandler $getAuraMessagesHandler,
        private AuraApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetAuraMessagesQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'aura', 'view_messages');

            // Executar query via handler
            $result = $this->getAuraMessagesHandler->handle($query);

            Log::info('Aura messages retrieved successfully', [
                'chat_id' => $query->chatId,
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Mensagens Aura recuperadas com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving Aura messages', [
                'chat_id' => $query->chatId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar mensagens Aura: ' . $e->getMessage()
            ];
        }
    }
}
