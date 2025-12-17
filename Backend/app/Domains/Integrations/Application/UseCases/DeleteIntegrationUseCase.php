<?php

namespace App\Domains\Integrations\Application\UseCases;

use App\Domains\Integrations\Application\Commands\DeleteIntegrationCommand;
use App\Domains\Integrations\Application\Handlers\DeleteIntegrationHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class DeleteIntegrationUseCase
{
    public function __construct(
        private DeleteIntegrationHandler $deleteIntegrationHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(DeleteIntegrationCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para deletar integrações
            if (!$this->permissionService->canDeleteIntegration($user, $command->integrationId)) {
                throw new \Exception("User does not have permission to delete this integration");
            }

            // Verificar se a integração tem dependências críticas
            $this->checkIntegrationDependencies($command->integrationId);

            // Executar deleção da integração
            $result = $this->deleteIntegrationHandler->handle($command);

            // Log da deleção
            Log::info("Integration deleted successfully", [
                'integration_id' => $command->integrationId,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to delete integration", [
                'integration_id' => $command->integrationId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function checkIntegrationDependencies(int $integrationId): void
    {
        // Verificar se existem workflows ativos usando esta integração
        // Verificar se existem campanhas ativas usando esta integração
        // Verificar se existem automações dependentes desta integração

        // Se houver dependências críticas e não for force delete, lançar exceção
        // Esta lógica seria implementada com base nos requisitos específicos
    }
}
