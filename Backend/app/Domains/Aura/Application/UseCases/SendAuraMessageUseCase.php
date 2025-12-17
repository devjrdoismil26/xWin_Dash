<?php

namespace App\Domains\Aura\Application\UseCases;

use App\Domains\Aura\Application\Commands\SendAuraMessageCommand;
use App\Domains\Aura\Application\Handlers\SendAuraMessageHandler;
use App\Domains\Aura\Application\Services\AuraApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class SendAuraMessageUseCase
{
    public function __construct(
        private SendAuraMessageHandler $sendAuraMessageHandler,
        private AuraApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(SendAuraMessageCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAuraRules($command->toArray());

            // Executar comando via handler
            $result = $this->sendAuraMessageHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('aura.message_sent', [
                'chat_id' => $command->chatId,
                'message_id' => $result['message']['id']
            ]);

            Log::info('Aura message sent successfully', [
                'chat_id' => $command->chatId,
                'message_id' => $result['message']['id']
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Mensagem enviada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error sending Aura message', [
                'chat_id' => $command->chatId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao enviar mensagem: ' . $e->getMessage()
            ];
        }
    }
}
