<?php

namespace App\Domains\Core\Application\UseCases;

use App\Domains\Core\Application\Commands\EnableModuleCommand;
use App\Domains\Core\Application\Handlers\EnableModuleHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class EnableModuleUseCase
{
    public function __construct(
        private EnableModuleHandler $enableModuleHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(EnableModuleCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para gerenciar módulos
            if (!$this->permissionService->canManageModules($user)) {
                throw new \Exception("User does not have permission to manage modules");
            }

            // Verificar se o usuário é admin ou tem permissão específica
            if (!$user->is_admin && !$this->permissionService->canEnableModule($user, $command->moduleName)) {
                throw new \Exception("User does not have permission to enable this module");
            }

            // Executar habilitação do módulo
            $result = $this->enableModuleHandler->handle($command);

            // Log da habilitação
            Log::info("Module enabled successfully", [
                'module_name' => $command->moduleName,
                'user_id' => $command->userId,
                'has_configuration' => !empty($command->configuration)
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to enable module", [
                'module_name' => $command->moduleName,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
