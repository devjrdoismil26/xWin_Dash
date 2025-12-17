<?php

namespace App\Domains\Workflows\Infrastructure\Persistence\Eloquent;

use App\Domains\Workflows\Domain\WorkflowLog; // Supondo que a entidade de domínio exista
use App\Domains\Workflows\Domain\WorkflowLogRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WorkflowLogRepository implements WorkflowLogRepositoryInterface
{
    protected WorkflowLogModel $model;

    public function __construct(WorkflowLogModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo registro de log de workflow.
     *
     * @param array<string, mixed> $data
     *
     * @return WorkflowLog
     */
    public function create(array $data): WorkflowLog
    {
        $logModel = $this->model->create($data);
        return WorkflowLog::fromArray($logModel->toArray());
    }

    /**
     * Encontra um registro de log de workflow pelo seu ID.
     *
     * @param string $id
     *
     * @return WorkflowLog|null
     */
    public function find(string $id): ?WorkflowLog
    {
        $logModel = $this->model->find($id);
        return $logModel ? WorkflowLog::fromArray($logModel->toArray()) : null;
    }

    /**
     * Retorna todos os logs de workflow paginados para uma execução específica.
     *
     * @param int $executionId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginatedForExecution(int $executionId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('workflow_execution_id', $executionId)->paginate($perPage)->through(function ($item) {
            return WorkflowLog::fromArray($item->toArray());
        });
    }

    /**
     * Deleta um registro de log pelo seu ID.
     *
     * @param string $id
     *
     * @return bool
     */
    public function delete(string $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * Atualiza um registro de log.
     *
     * @param string $id
     * @param array<string, mixed> $data
     *
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        $logModel = $this->model->find($id);
        if (!$logModel) {
            throw new \RuntimeException("Workflow Log not found.");
        }
        return $logModel->update($data);
    }

    /**
     * Encontra registros por Lead ID.
     *
     * @param string $leadId
     *
     * @return WorkflowLog|null
     */
    public function findByLeadId(string $leadId): ?WorkflowLog
    {
        $logModel = $this->model->where('lead_id', $leadId)->first();
        return $logModel ? WorkflowLog::fromArray($logModel->toArray()) : null;
    }

    /**
     * Encontra registros por Workflow ID.
     *
     * @param string $workflowId
     *
     * @return WorkflowLog|null
     */
    public function findByWorkflowId(string $workflowId): ?WorkflowLog
    {
        $logModel = $this->model->where('workflow_id', $workflowId)->first();
        return $logModel ? WorkflowLog::fromArray($logModel->toArray()) : null;
    }
}
