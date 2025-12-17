<?php

namespace App\Domains\Aura\Application\UseCases;

use App\Domains\Aura\Application\Commands\UpdateAuraChatCommand;
use App\Domains\Aura\Application\Handlers\UpdateAuraChatHandler;
use App\Domains\Aura\Application\Services\AuraApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class UpdateAuraChatUseCase
{
    public function __construct(
        private UpdateAuraChatHandler $updateAuraChatHandler,
        private AuraApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(UpdateAuraChatCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAuraRules($command->toArray());

            // Executar comando via handler
            $result = $this->updateAuraChatHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('aura.chat_updated', [
                'chat_id' => $command->chatId,
                'changes' => $command->toArray()
            ]);

            Log::info('Aura chat updated successfully', [
                'chat_id' => $command->chatId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Chat Aura atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating Aura chat', [
                'chat_id' => $command->chatId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atualizar chat Aura: ' . $e->getMessage()
            ];
        }
    }
}
