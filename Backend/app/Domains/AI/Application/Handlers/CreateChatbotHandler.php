<?php

namespace App\Domains\AI\Application\Handlers;

use App\Domains\AI\Application\Commands\CreateChatbotCommand;
use App\Domains\AI\Domain\Repositories\ChatbotRepositoryInterface;
use App\Domains\AI\Domain\Services\ChatbotService;
use App\Domains\AI\Domain\Services\AIModelService;
use Illuminate\Support\Facades\Log;

class CreateChatbotHandler
{
    public function __construct(
        private ChatbotRepositoryInterface $chatbotRepository,
        private ChatbotService $chatbotService,
        private AIModelService $modelService
    ) {
    }

    public function handle(CreateChatbotCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Criar o chatbot no domínio
            $chatbot = $this->chatbotService->createChatbot([
                'name' => $command->name,
                'description' => $command->description,
                'personality' => $command->personality,
                'knowledge_base' => $command->knowledgeBase,
                'settings' => $command->settings,
                'is_active' => $command->isActive
            ]);

            // Salvar no repositório
            $savedChatbot = $this->chatbotRepository->save($chatbot);

            // Inicializar o chatbot
            $this->chatbotService->initializeChatbot($savedChatbot);

            Log::info('Chatbot created successfully', [
                'chatbot_id' => $savedChatbot->id,
                'name' => $command->name
            ]);

            return [
                'chatbot' => $savedChatbot->toArray(),
                'message' => 'Chatbot criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating chatbot', [
                'name' => $command->name,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateChatbotCommand $command): void
    {
        if (empty($command->name)) {
            throw new \InvalidArgumentException('Nome é obrigatório');
        }

        if (empty($command->description)) {
            throw new \InvalidArgumentException('Descrição é obrigatória');
        }
    }
}
