<?php

namespace App\Domains\EmailMarketing\Domain;

// Supondo que a entidade de domínio exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EmailSegmentRepositoryInterface
{
    /**
     * Cria um novo segmento de e-mail.
     *
     * @param array $data
     *
     * @return EmailSegment
     */
    public function create(array $data): EmailSegment;

    /**
     * Encontra um segmento de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailSegment|null
     */
    public function find(int $id): ?EmailSegment;

    /**
     * Atualiza um segmento de e-mail existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return EmailSegment
     */
    public function update(int $id, array $data): EmailSegment;

    /**
     * Deleta um segmento de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Retorna todos os segmentos de e-mail paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getPaginatedForUser(int $userId, int $perPage = 15): LengthAwarePaginator;
}
