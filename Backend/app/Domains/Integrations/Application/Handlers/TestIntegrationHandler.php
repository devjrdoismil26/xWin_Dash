<?php

namespace App\Domains\Integrations\Application\Handlers;

use App\Domains\Integrations\Application\Commands\TestIntegrationCommand;
use App\Domains\Integrations\Services\IntegrationService;
use App\Domains\Integrations\Repositories\IntegrationRepository;
use App\Domains\Integrations\Exceptions\IntegrationNotFoundException;
use App\Domains\Integrations\Exceptions\IntegrationTestFailedException;
use Illuminate\Support\Facades\Log;

class TestIntegrationHandler
{
    public function __construct(
        private IntegrationService $integrationService,
        private IntegrationRepository $integrationRepository
    ) {
    }

    public function handle(TestIntegrationCommand $command): array
    {
        try {
            // Buscar a integração existente
            $integration = $this->integrationRepository->findById($command->integrationId);

            if (!$integration) {
                throw new IntegrationNotFoundException(
                    "Integration with ID {$command->integrationId} not found"
                );
            }

            // Validar se a integração está ativa
            if (!$integration->is_active) {
                throw new IntegrationTestFailedException(
                    "Cannot test inactive integration"
                );
            }

            // Executar o teste da integração
            $testResult = $this->integrationService->testIntegration(
                $integration,
                $command->testType,
                $command->testData
            );

            // Log do resultado do teste
            Log::info("Integration test completed", [
                'integration_id' => $integration->id,
                'integration_type' => $integration->type,
                'test_type' => $command->testType,
                'success' => $testResult['success'],
                'duration' => $testResult['duration'] ?? null
            ]);

            return [
                'success' => true,
                'integration_id' => $integration->id,
                'test_result' => $testResult,
                'tested_at' => now()->toISOString()
            ];
        } catch (IntegrationNotFoundException $e) {
            Log::error("Integration not found for testing", [
                'integration_id' => $command->integrationId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (IntegrationTestFailedException $e) {
            Log::error("Integration test failed", [
                'integration_id' => $command->integrationId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during integration test", [
                'integration_id' => $command->integrationId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new IntegrationTestFailedException(
                "Integration test failed: " . $e->getMessage()
            );
        }
    }
}
