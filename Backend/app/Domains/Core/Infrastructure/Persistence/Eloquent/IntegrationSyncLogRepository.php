<?php

namespace App\Domains\Core\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Domain\IntegrationSyncLog;
use App\Domains\Core\Domain\IntegrationSyncLogRepositoryInterface;

class IntegrationSyncLogRepository implements IntegrationSyncLogRepositoryInterface
{
    protected IntegrationSyncLogModel $model;

    public function __construct(IntegrationSyncLogModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo log de sincronização de integração.
     *
     * @param array<string, mixed> $data
     *
     * @return IntegrationSyncLog
     */
    public function create(array $data): IntegrationSyncLog
    {
        $logModel = IntegrationSyncLogModel::create($data);
        return IntegrationSyncLog::fromArray($logModel->toArray());
    }

    /**
     * Encontra um log de sincronização pelo seu ID.
     *
     * @param int $id
     *
     * @return IntegrationSyncLog|null
     */
    public function find(int $id): ?IntegrationSyncLog
    {
        /** @var \App\Domains\Core\Infrastructure\Persistence\Eloquent\IntegrationSyncLogModel|null $logModel */
        $logModel = IntegrationSyncLogModel::find($id);
        return $logModel ? IntegrationSyncLog::fromArray($logModel->toArray()) : null;
    }

    /**
     * Retorna logs de sincronização para uma integração específica.
     *
     * @param int $integrationId
     * @param int $limit
     *
     * @return array<IntegrationSyncLog>
     */
    public function getByIntegrationId(int $integrationId, int $limit = 10): array
    {
        return IntegrationSyncLogModel::where('integration_id', $integrationId)
                           ->latest()
                           ->limit($limit)
                           ->get()
                           ->map(function ($item) {
                               return IntegrationSyncLog::fromArray($item->toArray());
                           })->toArray();
    }
}
