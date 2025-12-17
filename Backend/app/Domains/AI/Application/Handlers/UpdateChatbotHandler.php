<?php

namespace App\Domains\AI\Application\Handlers;

use App\Domains\AI\Application\Commands\UpdateChatbotCommand;
use App\Domains\AI\Domain\Repositories\ChatbotRepositoryInterface;
use App\Domains\AI\Domain\Services\ChatbotService;
use Illuminate\Support\Facades\Log;

class UpdateChatbotHandler
{
    public function __construct(
        private ChatbotRepositoryInterface $chatbotRepository,
        private ChatbotService $chatbotService
    ) {
    }

    public function handle(UpdateChatbotCommand $command): array
    {
        try {
            // Buscar o chatbot existente
            $chatbot = $this->chatbotRepository->findById($command->chatbotId);

            if (!$chatbot) {
                throw new \Exception('Chatbot não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Atualizar o chatbot
            $updateData = array_filter([
                'name' => $command->name,
                'description' => $command->description,
                'personality' => $command->personality,
                'knowledge_base' => $command->knowledgeBase,
                'settings' => $command->settings,
                'is_active' => $command->isActive
            ], function ($value) {
                return $value !== null;
            });

            $updatedChatbot = $this->chatbotService->updateChatbot($chatbot, $updateData);

            // Salvar no repositório
            $savedChatbot = $this->chatbotRepository->save($updatedChatbot);

            Log::info('Chatbot updated successfully', [
                'chatbot_id' => $command->chatbotId
            ]);

            return [
                'chatbot' => $savedChatbot->toArray(),
                'message' => 'Chatbot atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating chatbot', [
                'chatbot_id' => $command->chatbotId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateChatbotCommand $command): void
    {
        if (empty($command->chatbotId)) {
            throw new \InvalidArgumentException('ID do chatbot é obrigatório');
        }
    }
}
