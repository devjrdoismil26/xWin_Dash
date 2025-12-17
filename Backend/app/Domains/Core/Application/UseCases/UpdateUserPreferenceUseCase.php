<?php

namespace App\Domains\Core\Application\UseCases;

use App\Domains\Core\Application\Commands\UpdateUserPreferenceCommand;
use App\Domains\Core\Application\Handlers\UpdateUserPreferenceHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class UpdateUserPreferenceUseCase
{
    public function __construct(
        private UpdateUserPreferenceHandler $updateUserPreferenceHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(UpdateUserPreferenceCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar se o usuário está tentando alterar suas próprias preferências
            // ou se tem permissão para alterar preferências de outros usuários
            if (!$this->permissionService->canUpdateUserPreferences($user, $command->userId)) {
                throw new \Exception("User does not have permission to update these preferences");
            }

            // Validar chave da preferência
            $this->validatePreferenceKey($command->preferenceKey);

            // Executar atualização da preferência
            $result = $this->updateUserPreferenceHandler->handle($command);

            // Log da atualização
            Log::info("User preference updated successfully", [
                'user_id' => $command->userId,
                'preference_key' => $command->preferenceKey,
                'category' => $command->category
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to update user preference", [
                'user_id' => $command->userId,
                'preference_key' => $command->preferenceKey,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validatePreferenceKey(string $key): void
    {
        // Validar formato da chave
        if (!preg_match('/^[a-zA-Z0-9._-]+$/', $key)) {
            throw new \Exception("Preference key can only contain letters, numbers, dots, underscores, and hyphens");
        }

        // Validar comprimento
        if (strlen($key) > 255) {
            throw new \Exception("Preference key cannot exceed 255 characters");
        }

        // Validar se não é uma chave reservada
        $reservedKeys = ['password', 'token', 'secret', 'key'];
        if (in_array(strtolower($key), $reservedKeys)) {
            throw new \Exception("Preference key '{$key}' is reserved and cannot be used");
        }
    }
}
