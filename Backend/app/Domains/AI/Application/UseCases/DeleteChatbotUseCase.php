<?php

namespace App\Domains\AI\Application\UseCases;

use App\Domains\AI\Application\Commands\DeleteChatbotCommand;
use App\Domains\AI\Application\Handlers\DeleteChatbotHandler;
use App\Domains\AI\Application\Services\AIApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class DeleteChatbotUseCase
{
    public function __construct(
        private DeleteChatbotHandler $deleteChatbotHandler,
        private AIApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(DeleteChatbotCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateChatbotDeletion($command->toArray());

            // Executar comando via handler
            $result = $this->deleteChatbotHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('ai.chatbot_deleted', [
                'chatbot_id' => $command->chatbotId,
                'force_delete' => $command->forceDelete
            ]);

            Log::info('Chatbot deleted successfully', [
                'chatbot_id' => $command->chatbotId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Chatbot excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting chatbot', [
                'chatbot_id' => $command->chatbotId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao excluir chatbot: ' . $e->getMessage()
            ];
        }
    }
}
