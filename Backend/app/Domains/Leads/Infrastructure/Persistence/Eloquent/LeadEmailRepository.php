<?php

namespace App\Domains\Leads\Infrastructure\Persistence\Eloquent;

use App\Domains\Leads\Domain\LeadEmail;
use App\Domains\Leads\Domain\LeadEmailRepositoryInterface;

class LeadEmailRepository implements LeadEmailRepositoryInterface
{
    protected LeadEmailModel $model;

    public function __construct(LeadEmailModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo e-mail de Lead.
     *
     * @param array $data
     *
     * @return LeadEmail
     */
    public function create(array $data): LeadEmail
    {
        $emailModel = $this->model->create($data);
        return LeadEmail::fromArray($emailModel->toArray());
    }

    /**
     * Encontra um e-mail de Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return LeadEmail|null
     */
    public function find(int $id): ?LeadEmail
    {
        $emailModel = $this->model->find($id);
        return $emailModel ? LeadEmail::fromArray($emailModel->toArray()) : null;
    }

    /**
     * Retorna todos os e-mails para um Lead específico.
     *
     * @param int $leadId
     *
     * @return array<LeadEmail>
     */
    public function getByLeadId(int $leadId): array
    {
        return $this->model->where('lead_id', $leadId)
                           ->get()
                           ->map(function ($item) {
                               return LeadEmail::fromArray($item->toArray());
                           })->toArray();
    }

    /**
     * Marca um e-mail como aberto.
     *
     * @param int $id
     *
     * @return bool
     */
    public function markAsOpened(int $id): bool
    {
        $emailModel = $this->model->find($id);
        if ($emailModel) {
            $emailModel->opened_at = now();
            return $emailModel->save();
        }
        return false;
    }

    /**
     * Marca um e-mail como clicado.
     *
     * @param int $id
     *
     * @return bool
     */
    public function markAsClicked(int $id): bool
    {
        $emailModel = $this->model->find($id);
        if ($emailModel) {
            $emailModel->clicked_at = now();
            return $emailModel->save();
        }
        return false;
    }
}
