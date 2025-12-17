<?php

namespace App\Domains\Aura\Application\Handlers;

use App\Domains\Aura\Application\Commands\CreateAuraChatCommand;
use App\Domains\Aura\Domain\Repositories\AuraChatRepositoryInterface;
use App\Domains\Aura\Domain\Services\AuraChatService;
use App\Domains\Aura\Domain\Services\AuraValidationService;
use Illuminate\Support\Facades\Log;

class CreateAuraChatHandler
{
    public function __construct(
        private AuraChatRepositoryInterface $auraChatRepository,
        private AuraChatService $auraChatService,
        private AuraValidationService $validationService
    ) {
    }

    public function handle(CreateAuraChatCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Validar regras de negócio
            $this->validationService->validateAuraChatCreation($command->toArray());

            // Criar o chat Aura no domínio
            $auraChat = $this->auraChatService->createChat([
                'title' => $command->title,
                'description' => $command->description,
                'personality' => $command->personality,
                'context' => $command->context,
                'settings' => $command->settings,
                'is_active' => $command->isActive
            ]);

            // Salvar no repositório
            $savedChat = $this->auraChatRepository->save($auraChat);

            // Inicializar o chat
            $this->auraChatService->initializeChat($savedChat);

            Log::info('Aura chat created successfully', [
                'chat_id' => $savedChat->id,
                'title' => $command->title
            ]);

            return [
                'chat' => $savedChat->toArray(),
                'message' => 'Chat Aura criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating Aura chat', [
                'title' => $command->title,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateAuraChatCommand $command): void
    {
        if (empty($command->title)) {
            throw new \InvalidArgumentException('Título é obrigatório');
        }
    }
}
