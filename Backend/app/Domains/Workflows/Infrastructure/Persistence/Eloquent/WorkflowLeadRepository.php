<?php

namespace App\Domains\Workflows\Infrastructure\Persistence\Eloquent;

use App\Domains\Workflows\Domain\WorkflowLead; // Supondo que a entidade de domínio exista
use App\Domains\Workflows\Domain\WorkflowLeadRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WorkflowLeadRepository implements WorkflowLeadRepositoryInterface
{
    protected WorkflowLeadModel $model;

    public function __construct(WorkflowLeadModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo registro de Lead associado a um workflow.
     *
     * @param array<string, mixed> $data
     *
     * @return WorkflowLead
     */
    public function create(array $data): WorkflowLead
    {
        $workflowLeadModel = $this->model->create($data);
        return WorkflowLead::fromArray($workflowLeadModel->toArray());
    }

    /**
     * Encontra um registro de Lead associado a um workflow pelo seu ID.
     *
     * @param string $id
     *
     * @return WorkflowLead|null
     */
    public function find(string $id): ?WorkflowLead
    {
        $workflowLeadModel = $this->model->find($id);
        return $workflowLeadModel ? WorkflowLead::fromArray($workflowLeadModel->toArray()) : null;
    }

    /**
     * Atualiza um registro de Lead associado a um workflow existente.
     *
     * @param string $id
     * @param array<string, mixed> $data
     *
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        $workflowLeadModel = $this->model->find($id);
        if (!$workflowLeadModel) {
            throw new \RuntimeException("Workflow Lead not found.");
        }
        return $workflowLeadModel->update($data);
    }

    /**
     * Deleta um registro de Lead associado a um workflow pelo seu ID.
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
     * Retorna todos os Leads associados a um workflow paginados.
     *
     * @param int $workflowId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginatedForWorkflow(int $workflowId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('workflow_id', $workflowId)->paginate($perPage)->through(function ($item) {
            return WorkflowLead::fromArray($item->toArray());
        });
    }

    /**
     * Encontra registros por Lead ID.
     *
     * @param string $leadId
     *
     * @return WorkflowLead|null
     */
    public function findByLeadId(string $leadId): ?WorkflowLead
    {
        $workflowLeadModel = $this->model->where('lead_id', $leadId)->first();
        return $workflowLeadModel ? WorkflowLead::fromArray($workflowLeadModel->toArray()) : null;
    }

    /**
     * Encontra registros por Workflow ID.
     *
     * @param string $workflowId
     *
     * @return WorkflowLead|null
     */
    public function findByWorkflowId(string $workflowId): ?WorkflowLead
    {
        $workflowLeadModel = $this->model->where('workflow_id', $workflowId)->first();
        return $workflowLeadModel ? WorkflowLead::fromArray($workflowLeadModel->toArray()) : null;
    }
}
