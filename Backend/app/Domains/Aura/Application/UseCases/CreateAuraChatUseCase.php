<?php

namespace App\Domains\Aura\Application\UseCases;

use App\Domains\Aura\Application\Commands\CreateAuraChatCommand;
use App\Domains\Aura\Application\Handlers\CreateAuraChatHandler;
use App\Domains\Aura\Application\Services\AuraApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class CreateAuraChatUseCase
{
    public function __construct(
        private CreateAuraChatHandler $createAuraChatHandler,
        private AuraApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(CreateAuraChatCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAuraRules($command->toArray());

            // Executar comando via handler
            $result = $this->createAuraChatHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('aura.chat_created', [
                'chat_id' => $result['chat']['id'],
                'title' => $command->title
            ]);

            Log::info('Aura chat created successfully', [
                'chat_id' => $result['chat']['id'],
                'title' => $command->title
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Chat Aura criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating Aura chat', [
                'title' => $command->title,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao criar chat Aura: ' . $e->getMessage()
            ];
        }
    }
}
