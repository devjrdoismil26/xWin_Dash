<?php

namespace App\Domains\Aura\Application\Handlers;

use App\Domains\Aura\Application\Queries\GetAuraMessagesQuery;
use App\Domains\Aura\Domain\Repositories\AuraChatRepositoryInterface;
use App\Domains\Aura\Domain\Services\AuraMessageService;
use Illuminate\Support\Facades\Log;

class GetAuraMessagesHandler
{
    public function __construct(
        private AuraChatRepositoryInterface $auraChatRepository,
        private AuraMessageService $auraMessageService
    ) {
    }

    public function handle(GetAuraMessagesQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Verificar se o chat existe
            $chat = $this->auraChatRepository->findById($query->chatId);
            if (!$chat) {
                throw new \Exception('Chat Aura não encontrado');
            }

            // Preparar filtros
            $filters = [
                'chat_id' => $query->chatId,
                'message_type' => $query->messageType,
                'date_from' => $query->dateFrom,
                'date_to' => $query->dateTo
            ];

            // Remover filtros vazios
            $filters = array_filter($filters, function ($value) {
                return $value !== null && $value !== '';
            });

            // Preparar opções de paginação
            $paginationOptions = [
                'page' => $query->page ?? 1,
                'per_page' => $query->perPage ?? 20,
                'sort_by' => 'created_at',
                'sort_direction' => 'desc'
            ];

            // Buscar mensagens
            $result = $this->auraMessageService->getMessages($filters, $paginationOptions);

            Log::info('Aura messages retrieved successfully', [
                'chat_id' => $query->chatId,
                'count' => count($result['data'] ?? [])
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving Aura messages', [
                'chat_id' => $query->chatId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetAuraMessagesQuery $query): void
    {
        if (empty($query->chatId)) {
            throw new \InvalidArgumentException('ID do chat é obrigatório');
        }
    }
}
