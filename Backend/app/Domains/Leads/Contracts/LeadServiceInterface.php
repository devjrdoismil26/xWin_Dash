<?php

namespace App\Domains\Leads\Contracts;

use App\Domains\Leads\Domain\Lead; // Supondo que a entidade de domínio exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface LeadServiceInterface
{
    /**
     * Cria um novo Lead.
     *
     * @param array $data
     *
     * @return Lead
     */
    public function createLead(array $data): Lead;

    /**
     * Obtém um Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return Lead|null
     */
    public function getLeadById(int $id): ?Lead;

    /**
     * Atualiza um Lead existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return Lead
     */
    public function updateLead(int $id, array $data): Lead;

    /**
     * Deleta um Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function deleteLead(int $id): bool;

    /**
     * Retorna todos os Leads paginados.
     *
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllLeads(int $perPage = 15): LengthAwarePaginator;

    /**
     * Atualiza o status de um Lead.
     *
     * @param int    $id
     * @param string $newStatus
     *
     * @return Lead
     */
    public function updateLeadStatus(int $id, string $newStatus): Lead;
}
