<?php

namespace App\Domains\Auth\Application\Handlers;

use App\Domains\Auth\Application\Queries\GetUserPermissionsQuery;
use App\Domains\Auth\Domain\Services\PermissionService;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Log;

class GetUserPermissionsHandler
{
    public function __construct(
        private PermissionService $permissionService,
        private UserRepositoryInterface $userRepository
    ) {
    }

    public function handle(GetUserPermissionsQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Verificar se o usuário existe
            $user = $this->userRepository->findById($query->userId);
            if (!$user) {
                throw new \Exception('Usuário não encontrado');
            }

            // Buscar permissões do usuário
            $permissions = $this->permissionService->getUserPermissions(
                $user,
                $query->module,
                $query->includeRoles
            );

            Log::info('User permissions retrieved successfully', [
                'user_id' => $query->userId,
                'module' => $query->module
            ]);

            return [
                'permissions' => $permissions,
                'user' => $user->toArray()
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving user permissions', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetUserPermissionsQuery $query): void
    {
        if (empty($query->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
