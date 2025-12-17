<?php

namespace App\Domains\Aura\Application\UseCases;

use App\Domains\Aura\Application\Commands\DeleteAuraChatCommand;
use App\Domains\Aura\Application\Handlers\DeleteAuraChatHandler;
use App\Domains\Aura\Application\Services\AuraApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class DeleteAuraChatUseCase
{
    public function __construct(
        private DeleteAuraChatHandler $deleteAuraChatHandler,
        private AuraApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(DeleteAuraChatCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAuraRules($command->toArray());

            // Executar comando via handler
            $result = $this->deleteAuraChatHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('aura.chat_deleted', [
                'chat_id' => $command->chatId,
                'force_delete' => $command->forceDelete
            ]);

            Log::info('Aura chat deleted successfully', [
                'chat_id' => $command->chatId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Chat Aura excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting Aura chat', [
                'chat_id' => $command->chatId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao excluir chat Aura: ' . $e->getMessage()
            ];
        }
    }
}
