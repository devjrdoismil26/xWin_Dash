<?php

namespace App\Domains\Core\Application\UseCases;

use App\Domains\Core\Application\Commands\CreateSettingCommand;
use App\Domains\Core\Application\Handlers\CreateSettingHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class CreateSettingUseCase
{
    public function __construct(
        private CreateSettingHandler $createSettingHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(CreateSettingCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para criar configurações
            if (!$this->permissionService->canCreateSetting($user)) {
                throw new \Exception("User does not have permission to create settings");
            }

            // Validar chave da configuração
            $this->validateSettingKey($command->key);

            // Executar criação da configuração
            $result = $this->createSettingHandler->handle($command);

            // Log da criação
            Log::info("Setting created successfully", [
                'setting_key' => $command->key,
                'type' => $command->type,
                'user_id' => $command->userId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to create setting", [
                'setting_key' => $command->key,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateSettingKey(string $key): void
    {
        // Validar formato da chave (ex: deve ter pelo menos um ponto)
        if (!str_contains($key, '.')) {
            throw new \Exception("Setting key must contain at least one dot (e.g., 'app.name')");
        }

        // Validar caracteres permitidos
        if (!preg_match('/^[a-zA-Z0-9._-]+$/', $key)) {
            throw new \Exception("Setting key can only contain letters, numbers, dots, underscores, and hyphens");
        }

        // Validar comprimento
        if (strlen($key) > 255) {
            throw new \Exception("Setting key cannot exceed 255 characters");
        }
    }
}
