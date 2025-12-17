<?php

namespace App\Domains\EmailMarketing\Contracts;

use App\Domains\EmailMarketing\Domain\EmailCampaign; // Supondo que a entidade de domínio exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EmailCampaignRepositoryInterface
{
    /**
     * Cria uma nova campanha de e-mail.
     *
     * @param array $data
     *
     * @return EmailCampaign
     */
    public function create(array $data): EmailCampaign;

    /**
     * Encontra uma campanha de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailCampaign|null
     */
    public function find(int $id): ?EmailCampaign;

    /**
     * Atualiza uma campanha de e-mail existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return EmailCampaign
     */
    public function update(int $id, array $data): EmailCampaign;

    /**
     * Deleta uma campanha de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Retorna todas as campanhas de e-mail paginadas.
     *
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator;
}
