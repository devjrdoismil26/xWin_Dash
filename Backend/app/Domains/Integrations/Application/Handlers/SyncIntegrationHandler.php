<?php

namespace App\Domains\Integrations\Application\Handlers;

use App\Domains\Integrations\Application\Commands\SyncIntegrationCommand;
use App\Domains\Integrations\Services\IntegrationService;
use App\Domains\Integrations\Repositories\IntegrationRepository;
use App\Domains\Integrations\Exceptions\IntegrationNotFoundException;
use App\Domains\Integrations\Exceptions\IntegrationSyncFailedException;
use Illuminate\Support\Facades\Log;

class SyncIntegrationHandler
{
    public function __construct(
        private IntegrationService $integrationService,
        private IntegrationRepository $integrationRepository
    ) {
    }

    public function handle(SyncIntegrationCommand $command): array
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
                throw new IntegrationSyncFailedException(
                    "Cannot sync inactive integration"
                );
            }

            // Executar a sincronização
            $syncResult = $this->integrationService->syncIntegration(
                $integration,
                $command->syncType,
                $command->syncOptions
            );

            // Atualizar timestamp da última sincronização
            $integration->last_sync_at = now();
            $this->integrationRepository->save($integration);

            // Log do resultado da sincronização
            Log::info("Integration sync completed", [
                'integration_id' => $integration->id,
                'integration_type' => $integration->type,
                'sync_type' => $command->syncType,
                'records_processed' => $syncResult['records_processed'] ?? 0,
                'records_created' => $syncResult['records_created'] ?? 0,
                'records_updated' => $syncResult['records_updated'] ?? 0,
                'records_failed' => $syncResult['records_failed'] ?? 0,
                'duration' => $syncResult['duration'] ?? null
            ]);

            return [
                'success' => true,
                'integration_id' => $integration->id,
                'sync_result' => $syncResult,
                'synced_at' => $integration->last_sync_at->toISOString()
            ];
        } catch (IntegrationNotFoundException $e) {
            Log::error("Integration not found for sync", [
                'integration_id' => $command->integrationId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (IntegrationSyncFailedException $e) {
            Log::error("Integration sync failed", [
                'integration_id' => $command->integrationId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during integration sync", [
                'integration_id' => $command->integrationId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new IntegrationSyncFailedException(
                "Integration sync failed: " . $e->getMessage()
            );
        }
    }
}
