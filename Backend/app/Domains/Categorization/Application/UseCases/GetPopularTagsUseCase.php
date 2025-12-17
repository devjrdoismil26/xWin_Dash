<?php

namespace App\Domains\Categorization\Application\UseCases;

use App\Domains\Categorization\Application\Queries\GetPopularTagsQuery;
use App\Domains\Categorization\Application\Handlers\GetPopularTagsHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class GetPopularTagsUseCase
{
    public function __construct(
        private GetPopularTagsHandler $getPopularTagsHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(GetPopularTagsQuery $query): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($query->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para visualizar tags
            if (!$this->permissionService->canViewTags($user)) {
                throw new \Exception("User does not have permission to view tags");
            }

            // Se um projeto específico foi solicitado, verificar acesso
            if ($query->projectId && !$this->permissionService->canAccessProject($user, $query->projectId)) {
                throw new \Exception("User does not have access to this project");
            }

            // Executar busca das tags populares
            $result = $this->getPopularTagsHandler->handle($query);

            // Log da consulta
            Log::info("Popular tags retrieved", [
                'user_id' => $query->userId,
                'project_id' => $query->projectId,
                'period' => $query->period,
                'limit' => $query->limit,
                'total_found' => count($result['tags'])
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to get popular tags", [
                'user_id' => $query->userId,
                'project_id' => $query->projectId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
