<?php

namespace App\Domains\Aura\Application\Handlers;

use App\Domains\Aura\Application\Commands\UpdateAuraChatCommand;
use App\Domains\Aura\Domain\Repositories\AuraChatRepositoryInterface;
use App\Domains\Aura\Domain\Services\AuraChatService;
use App\Domains\Aura\Domain\Services\AuraValidationService;
use Illuminate\Support\Facades\Log;

class UpdateAuraChatHandler
{
    public function __construct(
        private AuraChatRepositoryInterface $auraChatRepository,
        private AuraChatService $auraChatService,
        private AuraValidationService $validationService
    ) {
    }

    public function handle(UpdateAuraChatCommand $command): array
    {
        try {
            // Buscar o chat existente
            $chat = $this->auraChatRepository->findById($command->chatId);

            if (!$chat) {
                throw new \Exception('Chat Aura não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Validar regras de negócio
            $this->validationService->validateAuraChatUpdate($command->toArray());

            // Atualizar o chat
            $updateData = array_filter([
                'title' => $command->title,
                'description' => $command->description,
                'personality' => $command->personality,
                'context' => $command->context,
                'settings' => $command->settings,
                'is_active' => $command->isActive
            ], function ($value) {
                return $value !== null;
            });

            $updatedChat = $this->auraChatService->updateChat($chat, $updateData);

            // Salvar no repositório
            $savedChat = $this->auraChatRepository->save($updatedChat);

            Log::info('Aura chat updated successfully', [
                'chat_id' => $command->chatId
            ]);

            return [
                'chat' => $savedChat->toArray(),
                'message' => 'Chat Aura atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating Aura chat', [
                'chat_id' => $command->chatId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateAuraChatCommand $command): void
    {
        if (empty($command->chatId)) {
            throw new \InvalidArgumentException('ID do chat é obrigatório');
        }
    }
}
