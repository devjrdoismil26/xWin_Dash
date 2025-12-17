<?php

namespace App\Domains\Integrations\Application\UseCases;

use App\Domains\Integrations\Application\Commands\TestIntegrationCommand;
use App\Domains\Integrations\Application\Handlers\TestIntegrationHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class TestIntegrationUseCase
{
    public function __construct(
        private TestIntegrationHandler $testIntegrationHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(TestIntegrationCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para testar integrações
            if (!$this->permissionService->canTestIntegration($user, $command->integrationId)) {
                throw new \Exception("User does not have permission to test this integration");
            }

            // Validar tipo de teste
            $this->validateTestType($command->testType);

            // Executar teste da integração
            $result = $this->testIntegrationHandler->handle($command);

            // Log do teste
            Log::info("Integration test executed", [
                'integration_id' => $command->integrationId,
                'test_type' => $command->testType,
                'user_id' => $command->userId,
                'success' => $result['test_result']['success'] ?? false
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to test integration", [
                'integration_id' => $command->integrationId,
                'test_type' => $command->testType,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateTestType(string $testType): void
    {
        $allowedTestTypes = ['connection', 'authentication', 'data_sync', 'webhook', 'full'];

        if (!in_array($testType, $allowedTestTypes)) {
            throw new \Exception("Invalid test type. Allowed types: " . implode(', ', $allowedTestTypes));
        }
    }
}
