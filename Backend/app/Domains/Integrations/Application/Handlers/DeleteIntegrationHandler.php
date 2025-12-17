<?php

namespace App\Domains\Integrations\Application\Handlers;

use App\Domains\Integrations\Application\Commands\DeleteIntegrationCommand;
use App\Domains\Integrations\Domain\Repositories\IntegrationRepositoryInterface;
use App\Domains\Integrations\Domain\Services\IntegrationService;
use Illuminate\Support\Facades\Log;

class DeleteIntegrationHandler
{
    public function __construct(
        private IntegrationRepositoryInterface $integrationRepository,
        private IntegrationService $integrationService
    ) {
    }

    public function handle(DeleteIntegrationCommand $command): array
    {
        try {
            // Buscar a integração existente
            $integration = $this->integrationRepository->findById($command->integrationId);

            if (!$integration) {
                throw new \Exception('Integração não encontrada');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se há dados associados
            $hasAssociatedData = $this->integrationService->hasAssociatedData($integration);

            if ($hasAssociatedData && !$command->forceDelete) {
                throw new \Exception('Não é possível excluir integração com dados associados. Use forceDelete=true para forçar a exclusão.');
            }

            // Desativar a integração primeiro
            $this->integrationService->deactivateIntegration($integration);

            // Limpar dados associados se necessário
            if ($command->forceDelete) {
                $this->integrationService->cleanupAssociatedData($integration);
            }

            // Excluir a integração
            $this->integrationRepository->delete($command->integrationId);

            Log::info('Integration deleted successfully', [
                'integration_id' => $command->integrationId
            ]);

            return [
                'message' => 'Integração excluída com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting integration', [
                'integration_id' => $command->integrationId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(DeleteIntegrationCommand $command): void
    {
        if (empty($command->integrationId)) {
            throw new \InvalidArgumentException('ID da integração é obrigatório');
        }
    }
}
