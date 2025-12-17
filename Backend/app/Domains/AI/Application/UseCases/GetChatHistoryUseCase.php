<?php

namespace App\Domains\AI\Application\UseCases;

use App\Domains\AI\Application\Queries\GetChatHistoryQuery;
use App\Domains\AI\Application\Handlers\GetChatHistoryHandler;
use App\Domains\AI\Application\Services\AIApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetChatHistoryUseCase
{
    public function __construct(
        private GetChatHistoryHandler $getChatHistoryHandler,
        private AIApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetChatHistoryQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'ai', 'view_chat_history');

            // Executar query via handler
            $result = $this->getChatHistoryHandler->handle($query);

            Log::info('Chat history retrieved successfully', [
                'chatbot_id' => $query->chatbotId,
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Histórico de chat recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving chat history', [
                'chatbot_id' => $query->chatbotId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar histórico de chat: ' . $e->getMessage()
            ];
        }
    }
}
