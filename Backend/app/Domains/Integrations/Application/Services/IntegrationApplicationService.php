<?php

namespace App\Domains\Integrations\Application\Services;

use App\Domains\Integrations\Application\Commands\CreateIntegrationCommand;
use App\Domains\Integrations\Application\Commands\UpdateIntegrationCommand;
use App\Domains\Integrations\Application\Commands\DeleteIntegrationCommand;
use App\Domains\Integrations\Application\Commands\TestIntegrationCommand;
use App\Domains\Integrations\Application\Commands\SyncIntegrationCommand;
use App\Domains\Integrations\Application\Queries\GetIntegrationQuery;
use App\Domains\Integrations\Application\Queries\ListIntegrationsQuery;
use App\Domains\Integrations\Application\Queries\GetIntegrationStatusQuery;
use App\Domains\Integrations\Application\Queries\GetIntegrationLogsQuery;
use App\Domains\Integrations\Application\UseCases\CreateIntegrationUseCase;
use App\Domains\Integrations\Application\UseCases\UpdateIntegrationUseCase;
use App\Domains\Integrations\Application\UseCases\DeleteIntegrationUseCase;
use App\Domains\Integrations\Application\UseCases\TestIntegrationUseCase;
use App\Domains\Integrations\Application\UseCases\SyncIntegrationUseCase;
use App\Domains\Integrations\Application\UseCases\GetIntegrationUseCase;
use App\Domains\Integrations\Application\UseCases\ListIntegrationsUseCase;
use App\Domains\Integrations\Application\UseCases\GetIntegrationStatusUseCase;
use App\Domains\Integrations\Application\UseCases\GetIntegrationLogsUseCase;

class IntegrationApplicationService
{
    public function __construct(
        private CreateIntegrationUseCase $createIntegrationUseCase,
        private UpdateIntegrationUseCase $updateIntegrationUseCase,
        private DeleteIntegrationUseCase $deleteIntegrationUseCase,
        private TestIntegrationUseCase $testIntegrationUseCase,
        private SyncIntegrationUseCase $syncIntegrationUseCase,
        private GetIntegrationUseCase $getIntegrationUseCase,
        private ListIntegrationsUseCase $listIntegrationsUseCase,
        private GetIntegrationStatusUseCase $getIntegrationStatusUseCase,
        private GetIntegrationLogsUseCase $getIntegrationLogsUseCase
    ) {
    }

    public function createIntegration(CreateIntegrationCommand $command): array
    {
        return $this->createIntegrationUseCase->execute($command);
    }

    public function updateIntegration(UpdateIntegrationCommand $command): array
    {
        return $this->updateIntegrationUseCase->execute($command);
    }

    public function deleteIntegration(DeleteIntegrationCommand $command): array
    {
        return $this->deleteIntegrationUseCase->execute($command);
    }

    public function testIntegration(TestIntegrationCommand $command): array
    {
        return $this->testIntegrationUseCase->execute($command);
    }

    public function syncIntegration(SyncIntegrationCommand $command): array
    {
        return $this->syncIntegrationUseCase->execute($command);
    }

    public function getIntegration(GetIntegrationQuery $query): array
    {
        return $this->getIntegrationUseCase->execute($query);
    }

    public function listIntegrations(ListIntegrationsQuery $query): array
    {
        return $this->listIntegrationsUseCase->execute($query);
    }

    public function getIntegrationStatus(GetIntegrationStatusQuery $query): array
    {
        return $this->getIntegrationStatusUseCase->execute($query);
    }

    public function getIntegrationLogs(GetIntegrationLogsQuery $query): array
    {
        return $this->getIntegrationLogsUseCase->execute($query);
    }

    // Métodos de conveniência para operações comuns
    public function createApiIntegration(int $userId, string $name, string $provider, array $configuration): array
    {
        $command = new CreateIntegrationCommand(
            userId: $userId,
            name: $name,
            type: 'api',
            provider: $provider,
            configuration: $configuration
        );

        return $this->createIntegration($command);
    }

    public function createWebhookIntegration(int $userId, string $name, string $provider, array $configuration): array
    {
        $command = new CreateIntegrationCommand(
            userId: $userId,
            name: $name,
            type: 'webhook',
            provider: $provider,
            configuration: $configuration
        );

        return $this->createIntegration($command);
    }

    public function testConnection(int $userId, int $integrationId): array
    {
        $command = new TestIntegrationCommand(
            userId: $userId,
            integrationId: $integrationId,
            testType: 'connection'
        );

        return $this->testIntegration($command);
    }

    public function fullSync(int $userId, int $integrationId): array
    {
        $command = new SyncIntegrationCommand(
            userId: $userId,
            integrationId: $integrationId,
            syncType: 'full'
        );

        return $this->syncIntegration($command);
    }

    public function getActiveIntegrations(int $userId): array
    {
        $query = new ListIntegrationsQuery(
            userId: $userId,
            isActive: true,
            limit: 100,
            offset: 0
        );

        return $this->listIntegrations($query);
    }

    public function getIntegrationHealth(int $userId, int $integrationId): array
    {
        $query = new GetIntegrationStatusQuery(
            userId: $userId,
            integrationId: $integrationId
        );

        return $this->getIntegrationStatus($query);
    }
}
