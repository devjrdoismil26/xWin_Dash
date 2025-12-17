<?php

namespace App\Domains\AI\Application\UseCases;

use App\Domains\AI\Application\Commands\CreateChatbotCommand;
use App\Domains\AI\Application\Handlers\CreateChatbotHandler;
use App\Domains\AI\Application\Services\AIApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class CreateChatbotUseCase
{
    public function __construct(
        private CreateChatbotHandler $createChatbotHandler,
        private AIApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(CreateChatbotCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateChatbotCreation($command->toArray());

            // Executar comando via handler
            $result = $this->createChatbotHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('ai.chatbot_created', [
                'chatbot_id' => $result['chatbot']['id'],
                'name' => $command->name
            ]);

            Log::info('Chatbot created successfully', [
                'chatbot_id' => $result['chatbot']['id'],
                'name' => $command->name
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Chatbot criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating chatbot', [
                'name' => $command->name,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao criar chatbot: ' . $e->getMessage()
            ];
        }
    }
}
