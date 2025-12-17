<?php

namespace App\Domains\Users\Application\Handlers;

use App\Domains\Users\Application\Queries\GetUserQuery;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Users\Domain\Services\UserService;
use Illuminate\Support\Facades\Log;

class GetUserHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private UserService $userService
    ) {
    }

    public function handle(GetUserQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar o usuário
            $user = $this->userRepository->findById($query->userId);

            if (!$user) {
                return null;
            }

            // Enriquecer com dados adicionais se solicitado
            $result = $user->toArray();

            if ($query->includeProfile) {
                $result['profile'] = $this->userService->getUserProfile($user);
            }

            if ($query->includePreferences) {
                $result['preferences'] = $this->userService->getUserPreferences($user);
            }

            if ($query->includeActivity) {
                $result['activity'] = $this->userService->getUserActivity($user, 10);
            }

            if ($query->includePermissions) {
                $result['permissions'] = $this->userService->getUserPermissions($user);
            }

            Log::info('User retrieved successfully', [
                'user_id' => $query->userId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving user', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetUserQuery $query): void
    {
        if (empty($query->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
