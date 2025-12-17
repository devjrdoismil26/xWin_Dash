<?php

namespace App\Domains\AI\Application\Handlers;

use App\Domains\AI\Application\Queries\GetChatbotQuery;
use App\Domains\AI\Domain\Repositories\ChatbotRepositoryInterface;
use App\Domains\AI\Domain\Services\ChatbotService;
use Illuminate\Support\Facades\Log;

class GetChatbotHandler
{
    public function __construct(
        private ChatbotRepositoryInterface $chatbotRepository,
        private ChatbotService $chatbotService
    ) {
    }

    public function handle(GetChatbotQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar o chatbot
            $chatbot = $this->chatbotRepository->findById($query->chatbotId);

            if (!$chatbot) {
                return null;
            }

            // Enriquecer com dados adicionais se solicitado
            $result = $chatbot->toArray();

            if ($query->includeStats) {
                $result['stats'] = $this->chatbotService->getChatbotStats($chatbot);
            }

            if ($query->includeConversations) {
                $result['recent_conversations'] = $this->chatbotService->getRecentConversations($chatbot, 10);
            }

            Log::info('Chatbot retrieved successfully', [
                'chatbot_id' => $query->chatbotId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving chatbot', [
                'chatbot_id' => $query->chatbotId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetChatbotQuery $query): void
    {
        if (empty($query->chatbotId)) {
            throw new \InvalidArgumentException('ID do chatbot é obrigatório');
        }
    }
}
