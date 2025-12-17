<?php

namespace App\Domains\Leads\Domain;

interface LeadCustomValueRepositoryInterface
{
    /**
     * Cria um novo valor personalizado de Lead.
     *
     * @param array $data
     *
     * @return LeadCustomValue
     */
    public function create(array $data): LeadCustomValue;

    /**
     * Encontra um valor personalizado de Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return LeadCustomValue|null
     */
    public function find(int $id): ?LeadCustomValue;

    /**
     * Atualiza um valor personalizado de Lead existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return LeadCustomValue
     */
    public function update(int $id, array $data): LeadCustomValue;

    /**
     * Deleta um valor personalizado de Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Retorna todos os valores personalizados para um Lead específico.
     *
     * @param int $leadId
     *
     * @return array<LeadCustomValue>
     */
    public function getByLeadId(int $leadId): array;
}
