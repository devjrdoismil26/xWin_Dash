<?php

namespace App\Domains\Categorization\Application\UseCases;

use App\Domains\Categorization\Application\Queries\ListTagsQuery;
use App\Domains\Categorization\Application\Handlers\ListTagsHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class ListTagsUseCase
{
    public function __construct(
        private ListTagsHandler $listTagsHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(ListTagsQuery $query): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($query->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para listar tags
            if (!$this->permissionService->canListTags($user)) {
                throw new \Exception("User does not have permission to list tags");
            }

            // Se um projeto específico foi solicitado, verificar acesso
            if ($query->projectId && !$this->permissionService->canAccessProject($user, $query->projectId)) {
                throw new \Exception("User does not have access to this project");
            }

            // Executar listagem das tags
            $result = $this->listTagsHandler->handle($query);

            // Log da consulta
            Log::info("Tags listed", [
                'user_id' => $query->userId,
                'filters' => [
                    'project_id' => $query->projectId,
                    'search' => $query->search,
                    'color' => $query->color
                ],
                'total_found' => $result['pagination']['total']
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to list tags", [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
