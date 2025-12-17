<?php

namespace App\Domains\Leads\Repositories;

use App\Domains\Leads\Domain\LeadHistory;
use App\Domains\Leads\Domain\LeadHistoryRepositoryInterface;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadHistoryModel;

class LeadHistoryRepository implements LeadHistoryRepositoryInterface
{
    protected LeadHistoryModel $model;

    public function __construct(LeadHistoryModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo registro de histórico de Lead.
     *
     * @param array $data
     *
     * @return LeadHistory
     */
    public function create(array $data): LeadHistory
    {
        $historyModel = $this->model->create($data);
        return LeadHistory::fromArray($historyModel->toArray());
    }

    /**
     * Encontra um registro de histórico de Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return LeadHistory|null
     */
    public function find(int $id): ?LeadHistory
    {
        $historyModel = $this->model->find($id);
        return $historyModel ? LeadHistory::fromArray($historyModel->toArray()) : null;
    }

    /**
     * Retorna todos os registros de histórico para um Lead específico.
     *
     * @param int $leadId
     *
     * @return array<LeadHistory>
     */
    public function getByLeadId(int $leadId): array
    {
        return $this->model->where('lead_id', $leadId)
                           ->latest()
                           ->get()
                           ->map(function ($item) {
                               return LeadHistory::fromArray($item->toArray());
                           })->toArray();
    }
}
