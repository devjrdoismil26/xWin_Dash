<?php

namespace App\Domains\Leads\Domain;

// Supondo que a entidade de domínio exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SegmentRepositoryInterface
{
    /**
     * Cria um novo Segmento.
     *
     * @param array $data
     *
     * @return Segment
     */
    public function create(array $data): Segment;

    /**
     * Encontra um Segmento pelo seu ID.
     *
     * @param int $id
     *
     * @return Segment|null
     */
    public function find(int $id): ?Segment;

    /**
     * Atualiza um Segmento existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return Segment
     */
    public function update(int $id, array $data): Segment;

    /**
     * Deleta um Segmento pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Retorna todos os Segmentos paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getPaginatedForUser(int $userId, int $perPage = 15): LengthAwarePaginator;
}
