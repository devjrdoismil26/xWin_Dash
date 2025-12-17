<?php

namespace App\Domains\Users\Application\Handlers;

use App\Domains\Users\Application\Queries\GetUserActivityQuery;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Users\Domain\Services\UserService;
use Illuminate\Support\Facades\Log;

class GetUserActivityHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private UserService $userService
    ) {
    }

    public function handle(GetUserActivityQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Verificar se o usuário existe
            $user = $this->userRepository->findById($query->userId);
            if (!$user) {
                throw new \Exception('Usuário não encontrado');
            }

            // Preparar filtros
            $filters = [
                'user_id' => $query->userId,
                'activity_type' => $query->activityType,
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
                'sort_by' => $query->sortBy ?? 'created_at',
                'sort_direction' => $query->sortDirection ?? 'desc'
            ];

            // Buscar atividades
            $result = $this->userService->getUserActivity($user, $filters, $paginationOptions);

            Log::info('User activity retrieved successfully', [
                'user_id' => $query->userId,
                'count' => count($result['data'] ?? [])
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving user activity', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetUserActivityQuery $query): void
    {
        if (empty($query->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
