<?php

namespace App\Domains\Aura\Application\Handlers;

use App\Domains\Aura\Application\Queries\GetAuraChatQuery;
use App\Domains\Aura\Domain\Repositories\AuraChatRepositoryInterface;
use App\Domains\Aura\Domain\Services\AuraChatService;
use Illuminate\Support\Facades\Log;

class GetAuraChatHandler
{
    public function __construct(
        private AuraChatRepositoryInterface $auraChatRepository,
        private AuraChatService $auraChatService
    ) {
    }

    public function handle(GetAuraChatQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar o chat
            $chat = $this->auraChatRepository->findById($query->chatId);

            if (!$chat) {
                return null;
            }

            // Enriquecer com dados se solicitado
            $result = $chat->toArray();

            if ($query->includeMessages) {
                $result['messages'] = $this->auraChatService->getChatMessages(
                    $chat,
                    $query->messageLimit
                );
            }

            if ($query->includeContext) {
                $result['context'] = $this->auraChatService->getChatContext($chat);
            }

            Log::info('Aura chat retrieved successfully', [
                'chat_id' => $query->chatId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving Aura chat', [
                'chat_id' => $query->chatId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetAuraChatQuery $query): void
    {
        if (empty($query->chatId)) {
            throw new \InvalidArgumentException('ID do chat é obrigatório');
        }
    }
}
