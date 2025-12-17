<?php

namespace App\Domains\Integrations\Application\UseCases;

use App\Domains\Integrations\Application\Commands\CreateIntegrationCommand;
use App\Domains\Integrations\Application\Handlers\CreateIntegrationHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class CreateIntegrationUseCase
{
    public function __construct(
        private CreateIntegrationHandler $createIntegrationHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(CreateIntegrationCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para criar integrações
            if (!$this->permissionService->canCreateIntegration($user, $command->type)) {
                throw new \Exception("User does not have permission to create this type of integration");
            }

            // Validar configuração específica do tipo de integração
            $this->validateIntegrationConfiguration($command->type, $command->configuration);

            // Executar criação da integração
            $result = $this->createIntegrationHandler->handle($command);

            // Log da criação
            Log::info("Integration created successfully", [
                'integration_id' => $result['integration_id'],
                'type' => $command->type,
                'provider' => $command->provider,
                'user_id' => $command->userId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to create integration", [
                'type' => $command->type,
                'provider' => $command->provider,
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
                if (!isset($configuration['api_key']) || !isset($configuration['base_url'])) {
                    throw new \Exception("API integration requires api_key and base_url");
                }
                break;

            case 'webhook':
                if (!isset($configuration['webhook_url'])) {
                    throw new \Exception("Webhook integration requires webhook_url");
                }
                break;

            case 'database':
                if (!isset($configuration['connection_string'])) {
                    throw new \Exception("Database integration requires connection_string");
                }
                break;

            default:
                throw new \Exception("Unsupported integration type: {$type}");
        }
    }
}
