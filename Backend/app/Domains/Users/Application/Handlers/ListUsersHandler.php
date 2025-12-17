<?php

namespace App\Domains\Users\Application\Handlers;

use App\Domains\Users\Application\Queries\ListUsersQuery;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Users\Domain\Services\UserService;
use Illuminate\Support\Facades\Log;

class ListUsersHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private UserService $userService
    ) {
    }

    public function handle(ListUsersQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'search' => $query->search,
                'role' => $query->role,
                'is_active' => $query->isActive,
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
                'per_page' => $query->perPage ?? 15,
                'sort_by' => $query->sortBy ?? 'created_at',
                'sort_direction' => $query->sortDirection ?? 'desc'
            ];

            // Buscar usuários
            $result = $this->userRepository->findByFilters($filters, $paginationOptions);

            // Enriquecer com dados adicionais se solicitado
            if ($query->includeProfile) {
                foreach ($result['data'] as &$user) {
                    $user['profile'] = $this->userService->getUserProfile($user);
                }
            }

            if ($query->includeActivity) {
                foreach ($result['data'] as &$user) {
                    $user['recent_activity'] = $this->userService->getUserActivity($user, 5);
                }
            }

            Log::info('Users listed successfully', [
                'count' => count($result['data']),
                'filters' => $filters
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error listing users', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(ListUsersQuery $query): void
    {
        // Query de listagem não precisa de validações específicas
    }
}
