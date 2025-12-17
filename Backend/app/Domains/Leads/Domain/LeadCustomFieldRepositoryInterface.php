<?php

namespace App\Domains\Leads\Domain;

// Supondo que a entidade de domínio exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface LeadCustomFieldRepositoryInterface
{
    /**
     * Cria um novo campo personalizado de Lead.
     *
     * @param array $data
     *
     * @return LeadCustomField
     */
    public function create(array $data): LeadCustomField;

    /**
     * Encontra um campo personalizado de Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return LeadCustomField|null
     */
    public function find(int $id): ?LeadCustomField;

    /**
     * Atualiza um campo personalizado de Lead existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return LeadCustomField
     */
    public function update(int $id, array $data): LeadCustomField;

    /**
     * Deleta um campo personalizado de Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Retorna todos os campos personalizados de Lead paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getPaginatedForUser(int $userId, int $perPage = 15): LengthAwarePaginator;
}
