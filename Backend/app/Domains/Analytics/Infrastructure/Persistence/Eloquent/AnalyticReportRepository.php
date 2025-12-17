<?php

namespace App\Domains\Analytics\Infrastructure\Persistence\Eloquent;

use App\Domains\Analytics\Domain\AnalyticReportRepositoryInterface;
use App\Domains\Analytics\Models\AnalyticReport as AnalyticReportModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AnalyticReportRepository implements AnalyticReportRepositoryInterface
{
    protected AnalyticReportModel $model;

    public function __construct(AnalyticReportModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo relatório analítico.
     *
     * @param array $data
     *
     * @return AnalyticReportModel
     */
    public function create(array $data): AnalyticReportModel
    {
        return $this->model->create($data);
    }

    /**
     * Encontra um relatório analítico pelo seu ID.
     *
     * @param int $id
     *
     * @return AnalyticReportModel|null
     */
    public function find(int $id): ?AnalyticReportModel
    {
        return $this->model->find($id);
    }

    /**
     * Retorna todos os relatórios analíticos paginados.
     *
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }
}
