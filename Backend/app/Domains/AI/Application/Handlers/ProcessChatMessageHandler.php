<?php

namespace App\Domains\AI\Application\Handlers;

use App\Domains\AI\Application\Commands\ProcessChatMessageCommand;
use App\Domains\AI\Domain\Repositories\ChatbotRepositoryInterface;
use App\Domains\AI\Domain\Services\ChatbotService;
use App\Domains\AI\Domain\Services\AIContentGenerationService;
use Illuminate\Support\Facades\Log;

class ProcessChatMessageHandler
{
    public function __construct(
        private ChatbotRepositoryInterface $chatbotRepository,
        private ChatbotService $chatbotService,
        private AIContentGenerationService $contentGenerationService
    ) {
    }

    public function handle(ProcessChatMessageCommand $command): array
    {
        try {
            // Buscar o chatbot
            $chatbot = $this->chatbotRepository->findById($command->chatbotId);

            if (!$chatbot) {
                throw new \Exception('Chatbot não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Processar a mensagem
            $response = $this->chatbotService->processMessage([
                'chatbot' => $chatbot,
                'message' => $command->message,
                'session_id' => $command->sessionId,
                'context' => $command->context,
                'user_id' => $command->userId
            ]);

            // Salvar conversa
            $conversation = $this->chatbotService->saveConversation([
                'chatbot_id' => $command->chatbotId,
                'session_id' => $command->sessionId,
                'user_message' => $command->message,
                'bot_response' => $response['content'],
                'user_id' => $command->userId
            ]);

            Log::info('Chat message processed successfully', [
                'chatbot_id' => $command->chatbotId,
                'session_id' => $command->sessionId
            ]);

            return [
                'response' => $response,
                'conversation' => $conversation->toArray(),
                'message' => 'Mensagem processada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error processing chat message', [
                'chatbot_id' => $command->chatbotId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(ProcessChatMessageCommand $command): void
    {
        if (empty($command->chatbotId)) {
            throw new \InvalidArgumentException('ID do chatbot é obrigatório');
        }

        if (empty($command->message)) {
            throw new \InvalidArgumentException('Mensagem é obrigatória');
        }
    }
}
