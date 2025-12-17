<?php

namespace App\Domains\AI\Application\UseCases;

use App\Domains\AI\Application\Queries\GetChatbotQuery;
use App\Domains\AI\Application\Handlers\GetChatbotHandler;
use App\Domains\AI\Application\Services\AIApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetChatbotUseCase
{
    public function __construct(
        private GetChatbotHandler $getChatbotHandler,
        private AIApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetChatbotQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'ai', 'view_chatbot');

            // Executar query via handler
            $result = $this->getChatbotHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Chatbot não encontrado'
                ];
            }

            Log::info('Chatbot retrieved successfully', [
                'chatbot_id' => $query->chatbotId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Chatbot recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving chatbot', [
                'chatbot_id' => $query->chatbotId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar chatbot: ' . $e->getMessage()
            ];
        }
    }
}
