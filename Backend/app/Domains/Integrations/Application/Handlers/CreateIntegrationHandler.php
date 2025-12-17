<?php

namespace App\Domains\Integrations\Application\Handlers;

use App\Domains\Integrations\Application\Commands\CreateIntegrationCommand;
use App\Domains\Integrations\Domain\Repositories\IntegrationRepositoryInterface;
use App\Domains\Integrations\Domain\Services\IntegrationService;
use App\Domains\Integrations\Domain\Services\IntegrationValidationService;
use Illuminate\Support\Facades\Log;

class CreateIntegrationHandler
{
    public function __construct(
        private IntegrationRepositoryInterface $integrationRepository,
        private IntegrationService $integrationService,
        private IntegrationValidationService $validationService
    ) {
    }

    public function handle(CreateIntegrationCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Validar regras de negócio
            $this->validationService->validateIntegrationCreation($command->toArray());

            // Criar a integração no domínio
            $integration = $this->integrationService->createIntegration([
                'name' => $command->name,
                'type' => $command->type,
                'description' => $command->description,
                'configuration' => $command->configuration,
                'credentials' => $command->credentials,
                'is_active' => $command->isActive,
                'metadata' => $command->metadata
            ]);

            // Salvar no repositório
            $savedIntegration = $this->integrationRepository->save($integration);

            // Inicializar a integração
            $this->integrationService->initializeIntegration($savedIntegration);

            Log::info('Integration created successfully', [
                'integration_id' => $savedIntegration->id,
                'name' => $command->name,
                'type' => $command->type
            ]);

            return [
                'integration' => $savedIntegration->toArray(),
                'message' => 'Integração criada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating integration', [
                'name' => $command->name,
                'type' => $command->type,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateIntegrationCommand $command): void
    {
        if (empty($command->name)) {
            throw new \InvalidArgumentException('Nome é obrigatório');
        }

        if (empty($command->type)) {
            throw new \InvalidArgumentException('Tipo é obrigatório');
        }

        $validTypes = ['api', 'webhook', 'oauth', 'database', 'file', 'email'];
        if (!in_array($command->type, $validTypes)) {
            throw new \InvalidArgumentException('Tipo de integração inválido');
        }
    }
}
