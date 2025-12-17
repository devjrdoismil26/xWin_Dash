<?php

namespace App\Domains\Integrations\Application\UseCases;

use App\Domains\Integrations\Application\Commands\SyncIntegrationCommand;
use App\Domains\Integrations\Application\Handlers\SyncIntegrationHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class SyncIntegrationUseCase
{
    public function __construct(
        private SyncIntegrationHandler $syncIntegrationHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(SyncIntegrationCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para sincronizar integrações
            if (!$this->permissionService->canSyncIntegration($user, $command->integrationId)) {
                throw new \Exception("User does not have permission to sync this integration");
            }

            // Validar tipo de sincronização
            $this->validateSyncType($command->syncType);

            // Verificar se não há sincronização em andamento
            $this->checkConcurrentSync($command->integrationId);

            // Executar sincronização da integração
            $result = $this->syncIntegrationHandler->handle($command);

            // Log da sincronização
            Log::info("Integration sync executed", [
                'integration_id' => $command->integrationId,
                'sync_type' => $command->syncType,
                'user_id' => $command->userId,
                'records_processed' => $result['sync_result']['records_processed'] ?? 0
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to sync integration", [
                'integration_id' => $command->integrationId,
                'sync_type' => $command->syncType,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateSyncType(string $syncType): void
    {
        $allowedSyncTypes = ['full', 'incremental', 'manual', 'scheduled'];

        if (!in_array($syncType, $allowedSyncTypes)) {
            throw new \Exception("Invalid sync type. Allowed types: " . implode(', ', $allowedSyncTypes));
        }
    }

    private function checkConcurrentSync(int $integrationId): void
    {
        // Verificar se já existe uma sincronização em andamento para esta integração
        // Implementar lógica de lock ou verificação de status
        // Se houver sincronização em andamento, lançar exceção ou aguardar
    }
}
