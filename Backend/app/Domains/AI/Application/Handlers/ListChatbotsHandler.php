<?php

namespace App\Domains\AI\Application\Handlers;

use App\Domains\AI\Application\Queries\ListChatbotsQuery;
use App\Domains\AI\Domain\Repositories\ChatbotRepositoryInterface;
use App\Domains\AI\Domain\Services\ChatbotService;
use Illuminate\Support\Facades\Log;

class ListChatbotsHandler
{
    public function __construct(
        private ChatbotRepositoryInterface $chatbotRepository,
        private ChatbotService $chatbotService
    ) {
    }

    public function handle(ListChatbotsQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'search' => $query->search,
                'is_active' => $query->isActive
            ];

            // Remover filtros vazios
            $filters = array_filter($filters, function ($value) {
                return $value !== null && $value !== '';
            });

            // Preparar opções de paginação
            $paginationOptions = [
                'page' => $query->page ?? 1,
                'per_page' => $query->perPage ?? 15,
                'sort_by' => $query->sortBy ?? 'created_at',
                'sort_direction' => $query->sortDirection ?? 'desc'
            ];

            // Buscar chatbots
            $result = $this->chatbotRepository->findByFilters($filters, $paginationOptions);

            Log::info('Chatbots listed successfully', [
                'count' => count($result['data']),
                'filters' => $filters
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error listing chatbots', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(ListChatbotsQuery $query): void
    {
        // Query de listagem não precisa de validações específicas
    }
}
