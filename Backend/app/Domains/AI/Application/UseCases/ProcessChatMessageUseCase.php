<?php

namespace App\Domains\AI\Application\UseCases;

use App\Domains\AI\Application\Commands\ProcessChatMessageCommand;
use App\Domains\AI\Application\Handlers\ProcessChatMessageHandler;
use App\Domains\AI\Application\Services\AIApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class ProcessChatMessageUseCase
{
    public function __construct(
        private ProcessChatMessageHandler $processChatMessageHandler,
        private AIApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(ProcessChatMessageCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateChatMessageProcessing($command->toArray());

            // Executar comando via handler
            $result = $this->processChatMessageHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('ai.chat_message_processed', [
                'chatbot_id' => $command->chatbotId,
                'session_id' => $command->sessionId,
                'user_id' => $command->userId
            ]);

            Log::info('Chat message processed successfully', [
                'chatbot_id' => $command->chatbotId,
                'session_id' => $command->sessionId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Mensagem processada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error processing chat message', [
                'chatbot_id' => $command->chatbotId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao processar mensagem: ' . $e->getMessage()
            ];
        }
    }
}
