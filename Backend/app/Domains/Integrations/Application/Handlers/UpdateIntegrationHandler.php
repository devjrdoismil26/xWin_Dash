<?php

namespace App\Domains\Integrations\Application\Handlers;

use App\Domains\Integrations\Application\Commands\UpdateIntegrationCommand;
use App\Domains\Integrations\Domain\Repositories\IntegrationRepositoryInterface;
use App\Domains\Integrations\Domain\Services\IntegrationService;
use App\Domains\Integrations\Domain\Services\IntegrationValidationService;
use Illuminate\Support\Facades\Log;

class UpdateIntegrationHandler
{
    public function __construct(
        private IntegrationRepositoryInterface $integrationRepository,
        private IntegrationService $integrationService,
        private IntegrationValidationService $validationService
    ) {
    }

    public function handle(UpdateIntegrationCommand $command): array
    {
        try {
            // Buscar a integração existente
            $integration = $this->integrationRepository->findById($command->integrationId);

            if (!$integration) {
                throw new \Exception('Integração não encontrada');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Validar regras de negócio
            $this->validationService->validateIntegrationUpdate($command->toArray());

            // Atualizar a integração
            $updateData = array_filter([
                'name' => $command->name,
                'type' => $command->type,
                'description' => $command->description,
                'configuration' => $command->configuration,
                'credentials' => $command->credentials,
                'is_active' => $command->isActive,
                'metadata' => $command->metadata
            ], function ($value) {
                return $value !== null;
            });

            $updatedIntegration = $this->integrationService->updateIntegration($integration, $updateData);

            // Salvar no repositório
            $savedIntegration = $this->integrationRepository->save($updatedIntegration);

            Log::info('Integration updated successfully', [
                'integration_id' => $command->integrationId
            ]);

            return [
                'integration' => $savedIntegration->toArray(),
                'message' => 'Integração atualizada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating integration', [
                'integration_id' => $command->integrationId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateIntegrationCommand $command): void
    {
        if (empty($command->integrationId)) {
            throw new \InvalidArgumentException('ID da integração é obrigatório');
        }

        if ($command->type) {
            $validTypes = ['api', 'webhook', 'oauth', 'database', 'file', 'email'];
            if (!in_array($command->type, $validTypes)) {
                throw new \InvalidArgumentException('Tipo de integração inválido');
            }
        }
    }
}
