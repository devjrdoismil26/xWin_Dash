<?php

namespace App\Domains\Activity\Domain;

use App\Domains\Activity\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ActivityLogRepositoryInterface
{
    /**
     * Cria um novo log de atividade.
     *
     * @param array $data
     *
     * @return ActivityLog
     */
    public function create(array $data): ActivityLog;

    /**
     * Encontra um log de atividade pelo seu ID.
     *
     * @param int $id
     *
     * @return ActivityLog|null
     */
    public function find(int $id): ?ActivityLog;

    /**
     * Retorna todos os logs de atividade paginados.
     *
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get activity statistics.
     *
     * @return array
     */
    public function getStats(): array;

    /**
     * Export activity logs.
     *
     * @param string $format
     * @param array $filters
     * @return array
     */
    public function export(string $format, array $filters = []): array;

    /**
     * Get recent activity updates.
     *
     * @param int $limit
     * @return array
     */
    public function getRecentUpdates(int $limit = 10): array;

    /**
     * Bulk delete activity logs.
     *
     * @param array $ids
     * @return int
     */
    public function bulkDelete(array $ids): int;

    /**
     * Get available filters for activity logs.
     *
     * @return array
     */
    public function getAvailableFilters(): array;
}
