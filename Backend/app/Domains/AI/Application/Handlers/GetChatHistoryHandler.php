<?php

namespace App\Domains\AI\Application\Handlers;

use App\Domains\AI\Application\Queries\GetChatHistoryQuery;
use App\Domains\AI\Domain\Repositories\ChatbotRepositoryInterface;
use App\Domains\AI\Domain\Services\ChatbotService;
use Illuminate\Support\Facades\Log;

class GetChatHistoryHandler
{
    public function __construct(
        private ChatbotRepositoryInterface $chatbotRepository,
        private ChatbotService $chatbotService
    ) {
    }

    public function handle(GetChatHistoryQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Verificar se o chatbot existe
            $chatbot = $this->chatbotRepository->findById($query->chatbotId);
            if (!$chatbot) {
                throw new \Exception('Chatbot não encontrado');
            }

            // Preparar filtros
            $filters = [
                'chatbot_id' => $query->chatbotId,
                'session_id' => $query->sessionId,
                'user_id' => $query->userId
            ];

            // Remover filtros vazios
            $filters = array_filter($filters, function ($value) {
                return $value !== null && $value !== '';
            });

            // Preparar opções de paginação
            $paginationOptions = [
                'page' => $query->page ?? 1,
                'per_page' => $query->perPage ?? 20,
                'sort_by' => 'created_at',
                'sort_direction' => 'desc'
            ];

            // Buscar histórico
            $result = $this->chatbotService->getChatHistory($filters, $paginationOptions);

            Log::info('Chat history retrieved successfully', [
                'chatbot_id' => $query->chatbotId,
                'count' => count($result['data'] ?? [])
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving chat history', [
                'chatbot_id' => $query->chatbotId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetChatHistoryQuery $query): void
    {
        if (empty($query->chatbotId)) {
            throw new \InvalidArgumentException('ID do chatbot é obrigatório');
        }
    }
}
