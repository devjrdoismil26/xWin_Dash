<?php

namespace App\Domains\Leads\Domain;

interface LeadHistoryRepositoryInterface
{
    /**
     * Cria um novo registro de histórico de Lead.
     *
     * @param array $data
     *
     * @return LeadHistory
     */
    public function create(array $data): LeadHistory;

    /**
     * Encontra um registro de histórico de Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return LeadHistory|null
     */
    public function find(int $id): ?LeadHistory;

    /**
     * Retorna todos os registros de histórico para um Lead específico.
     *
     * @param int $leadId
     *
     * @return array<LeadHistory>
     */
    public function getByLeadId(int $leadId): array;
}
