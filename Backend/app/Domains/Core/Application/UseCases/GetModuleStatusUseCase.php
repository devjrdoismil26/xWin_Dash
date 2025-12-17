<?php

namespace App\Domains\Core\Application\UseCases;

use App\Domains\Core\Application\Queries\GetModuleStatusQuery;
use App\Domains\Core\Application\Handlers\GetModuleStatusHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class GetModuleStatusUseCase
{
    public function __construct(
        private GetModuleStatusHandler $getModuleStatusHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(GetModuleStatusQuery $query): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($query->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para visualizar status de módulos
            if (!$this->permissionService->canViewModuleStatus($user)) {
                throw new \Exception("User does not have permission to view module status");
            }

            // Executar busca do status
            $result = $this->getModuleStatusHandler->handle($query);

            // Log da consulta
            Log::info("Module status retrieved", [
                'user_id' => $query->userId,
                'module_name' => $query->moduleName,
                'include_configuration' => $query->includeConfiguration
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to get module status", [
                'user_id' => $query->userId,
                'module_name' => $query->moduleName,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
