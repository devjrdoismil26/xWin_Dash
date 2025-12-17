<?php

namespace App\Domains\Integrations\Application\UseCases;

use App\Domains\Integrations\Application\Commands\UpdateIntegrationCommand;
use App\Domains\Integrations\Application\Handlers\UpdateIntegrationHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class UpdateIntegrationUseCase
{
    public function __construct(
        private UpdateIntegrationHandler $updateIntegrationHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(UpdateIntegrationCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para atualizar integrações
            if (!$this->permissionService->canUpdateIntegration($user, $command->integrationId)) {
                throw new \Exception("User does not have permission to update this integration");
            }

            // Validar configuração se fornecida
            if ($command->configuration) {
                $this->validateIntegrationConfiguration($command->type, $command->configuration);
            }

            // Executar atualização da integração
            $result = $this->updateIntegrationHandler->handle($command);

            // Log da atualização
            Log::info("Integration updated successfully", [
                'integration_id' => $command->integrationId,
                'user_id' => $command->userId,
                'updated_fields' => array_keys($command->toArray())
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to update integration", [
                'integration_id' => $command->integrationId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateIntegrationConfiguration(string $type, array $configuration): void
    {
        switch ($type) {
            case 'api':
                if (isset($configuration['api_key']) && empty($configuration['api_key'])) {
                    throw new \Exception("API key cannot be empty");
                }
                if (isset($configuration['base_url']) && !filter_var($configuration['base_url'], FILTER_VALIDATE_URL)) {
                    throw new \Exception("Invalid base URL format");
                }
                break;

            case 'webhook':
                if (isset($configuration['webhook_url']) && !filter_var($configuration['webhook_url'], FILTER_VALIDATE_URL)) {
                    throw new \Exception("Invalid webhook URL format");
                }
                break;

            case 'database':
                if (isset($configuration['connection_string']) && empty($configuration['connection_string'])) {
                    throw new \Exception("Connection string cannot be empty");
                }
                break;
        }
    }
}
