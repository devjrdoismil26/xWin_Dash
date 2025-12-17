<?php

namespace App\Domains\Leads\Infrastructure\Persistence\Eloquent;

use App\Domains\Leads\Domain\LeadCustomValue;
use App\Domains\Leads\Domain\LeadCustomValueRepositoryInterface;

class LeadCustomValueRepository implements LeadCustomValueRepositoryInterface
{
    protected LeadCustomValueModel $model;

    public function __construct(LeadCustomValueModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo valor personalizado de Lead.
     *
     * @param array $data
     *
     * @return LeadCustomValue
     */
    public function create(array $data): LeadCustomValue
    {
        $valueModel = $this->model->create($data);
        return LeadCustomValue::fromArray($valueModel->toArray());
    }

    /**
     * Encontra um valor personalizado de Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return LeadCustomValue|null
     */
    public function find(int $id): ?LeadCustomValue
    {
        $valueModel = $this->model->find($id);
        return $valueModel ? LeadCustomValue::fromArray($valueModel->toArray()) : null;
    }

    /**
     * Atualiza um valor personalizado de Lead existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return LeadCustomValue
     */
    public function update(int $id, array $data): LeadCustomValue
    {
        $valueModel = $this->model->find($id);
        if (!$valueModel) {
            throw new \RuntimeException("Lead Custom Value not found.");
        }
        $valueModel->update($data);
        return LeadCustomValue::fromArray($valueModel->toArray());
    }

    /**
     * Deleta um valor personalizado de Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * Retorna todos os valores personalizados para um Lead específico.
     *
     * @param int $leadId
     *
     * @return array<LeadCustomValue>
     */
    public function getByLeadId(int $leadId): array
    {
        return $this->model->where('lead_id', $leadId)
                           ->get()
                           ->map(function ($item) {
                               return LeadCustomValue::fromArray($item->toArray());
                           })->toArray();
    }
}
