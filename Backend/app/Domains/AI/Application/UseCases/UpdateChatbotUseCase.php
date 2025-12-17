<?php

namespace App\Domains\AI\Application\UseCases;

use App\Domains\AI\Application\Commands\UpdateChatbotCommand;
use App\Domains\AI\Application\Handlers\UpdateChatbotHandler;
use App\Domains\AI\Application\Services\AIApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class UpdateChatbotUseCase
{
    public function __construct(
        private UpdateChatbotHandler $updateChatbotHandler,
        private AIApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(UpdateChatbotCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateChatbotUpdate($command->toArray());

            // Executar comando via handler
            $result = $this->updateChatbotHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('ai.chatbot_updated', [
                'chatbot_id' => $command->chatbotId,
                'changes' => $command->toArray()
            ]);

            Log::info('Chatbot updated successfully', [
                'chatbot_id' => $command->chatbotId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Chatbot atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating chatbot', [
                'chatbot_id' => $command->chatbotId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atualizar chatbot: ' . $e->getMessage()
            ];
        }
    }
}
