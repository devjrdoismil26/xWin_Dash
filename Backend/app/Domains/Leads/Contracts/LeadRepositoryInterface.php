<?php

namespace App\Domains\Leads\Contracts;

use App\Domains\Leads\Domain\Lead; // Supondo que a entidade de domínio exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface LeadRepositoryInterface
{
    /**
     * Cria um novo Lead.
     *
     * @param array $data
     *
     * @return Lead
     */
    public function create(array $data): Lead;

    /**
     * Encontra um Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return Lead|null
     */
    public function find(int $id): ?Lead;

    /**
     * Encontra um Lead pelo seu e-mail.
     *
     * @param string $email
     *
     * @return Lead|null
     */
    public function findByEmail(string $email): ?Lead;

    /**
     * Atualiza um Lead existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return Lead
     */
    public function update(int $id, array $data): Lead;

    /**
     * Deleta um Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Retorna todos os Leads paginados.
     *
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator;

    /**
     * Retorna Leads paginados com filtros.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function paginate(array $filters = []): LengthAwarePaginator;
}
