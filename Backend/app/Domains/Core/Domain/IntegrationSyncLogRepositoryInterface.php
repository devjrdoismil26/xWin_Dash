<?php

namespace App\Domains\Core\Domain;

interface IntegrationSyncLogRepositoryInterface
{
    /**
     * Cria um novo log de sincronização de integração.
     *
     * @param array<string, mixed> $data
     *
     * @return IntegrationSyncLog
     */
    public function create(array $data): IntegrationSyncLog;

    /**
     * Encontra um log de sincronização pelo seu ID.
     *
     * @param int $id
     *
     * @return IntegrationSyncLog|null
     */
    public function find(int $id): ?IntegrationSyncLog;

    /**
     * Retorna logs de sincronização para uma integração específica.
     *
     * @param int $integrationId
     * @param int $limit
     *
     * @return array<IntegrationSyncLog>
     */
    public function getByIntegrationId(int $integrationId, int $limit = 10): array;
}
