<?php

namespace App\Domains\Analytics\Domain;

use App\Domains\Analytics\Models\AnalyticReport; // Supondo que o Model exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AnalyticReportRepositoryInterface
{
    /**
     * Cria um novo relatório analítico.
     *
     * @param array $data
     *
     * @return AnalyticReport
     */
    public function create(array $data): AnalyticReport;

    /**
     * Encontra um relatório analítico pelo seu ID.
     *
     * @param int $id
     *
     * @return AnalyticReport|null
     */
    public function find(int $id): ?AnalyticReport;

    /**
     * Retorna todos os relatórios analíticos paginados.
     *
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator;
}
