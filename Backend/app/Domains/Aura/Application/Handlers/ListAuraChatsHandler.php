<?php

namespace App\Domains\Aura\Application\Handlers;

use App\Domains\Aura\Application\Queries\ListAuraChatsQuery;
use App\Domains\Aura\Domain\Repositories\AuraChatRepositoryInterface;
use Illuminate\Support\Facades\Log;

class ListAuraChatsHandler
{
    public function __construct(
        private AuraChatRepositoryInterface $auraChatRepository
    ) {
    }

    public function handle(ListAuraChatsQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'search' => $query->search,
                'personality' => $query->personality,
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

            // Buscar chats
            $result = $this->auraChatRepository->findByFilters($filters, $paginationOptions);

            Log::info('Aura chats listed successfully', [
                'count' => count($result['data']),
                'filters' => $filters
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error listing Aura chats', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(ListAuraChatsQuery $query): void
    {
        // Query de listagem não precisa de validações específicas
    }
}
