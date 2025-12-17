<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Contracts\EmailCampaignRepositoryInterface;
use App\Domains\EmailMarketing\Domain\EmailCampaign;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EmailCampaignRepository implements EmailCampaignRepositoryInterface
{
    protected EmailCampaignModel $model;

    public function __construct(EmailCampaignModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria uma nova campanha de e-mail.
     *
     * @param array $data
     *
     * @return EmailCampaign
     */
    public function create(array $data): EmailCampaign
    {
        $campaignModel = $this->model->create($data);
        return EmailCampaign::fromArray($campaignModel->toArray());
    }

    /**
     * Encontra uma campanha de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailCampaign|null
     */
    public function find(int $id): ?EmailCampaign
    {
        $campaignModel = $this->model->find($id);
        return $campaignModel ? EmailCampaign::fromArray($campaignModel->toArray()) : null;
    }

    /**
     * Atualiza uma campanha de e-mail existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return EmailCampaign
     */
    public function update(int $id, array $data): EmailCampaign
    {
        $campaignModel = $this->model->find($id);
        if (!$campaignModel) {
            throw new \RuntimeException("Email Campaign not found.");
        }
        $campaignModel->update($data);
        return EmailCampaign::fromArray($campaignModel->toArray());
    }

    /**
     * Deleta uma campanha de e-mail pelo seu ID.
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
     * Retorna todas as campanhas de e-mail paginadas.
     *
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage)->through(function ($item) {
            return EmailCampaign::fromArray($item->toArray());
        });
    }
}
