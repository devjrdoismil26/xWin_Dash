<?php

namespace App\Domains\Aura\Application\Handlers;

use App\Domains\Aura\Application\Commands\DeleteAuraChatCommand;
use App\Domains\Aura\Domain\Repositories\AuraChatRepositoryInterface;
use App\Domains\Aura\Domain\Services\AuraChatService;
use Illuminate\Support\Facades\Log;

class DeleteAuraChatHandler
{
    public function __construct(
        private AuraChatRepositoryInterface $auraChatRepository,
        private AuraChatService $auraChatService
    ) {
    }

    public function handle(DeleteAuraChatCommand $command): array
    {
        try {
            // Buscar o chat existente
            $chat = $this->auraChatRepository->findById($command->chatId);

            if (!$chat) {
                throw new \Exception('Chat Aura não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se há dados associados
            $hasAssociatedData = $this->auraChatService->hasAssociatedData($chat);

            if ($hasAssociatedData && !$command->forceDelete) {
                throw new \Exception('Não é possível excluir chat com dados associados. Use forceDelete=true para forçar a exclusão.');
            }

            // Limpar dados associados se necessário
            if ($command->forceDelete) {
                $this->auraChatService->cleanupAssociatedData($chat);
            }

            // Excluir o chat
            $this->auraChatRepository->delete($command->chatId);

            Log::info('Aura chat deleted successfully', [
                'chat_id' => $command->chatId
            ]);

            return [
                'message' => 'Chat Aura excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting Aura chat', [
                'chat_id' => $command->chatId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(DeleteAuraChatCommand $command): void
    {
        if (empty($command->chatId)) {
            throw new \InvalidArgumentException('ID do chat é obrigatório');
        }
    }
}
