<?php

namespace App\Domains\EmailMarketing\Domain;

// Supondo que a entidade de domínio exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EmailListRepositoryInterface
{
    /**
     * Cria uma nova lista de e-mail.
     *
     * @param array $data
     *
     * @return EmailList
     */
    public function create(array $data): EmailList;

    /**
     * Encontra uma lista de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailList|null
     */
    public function find(int $id): ?EmailList;

    /**
     * Atualiza uma lista de e-mail existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return EmailList
     */
    public function update(int $id, array $data): EmailList;

    /**
     * Deleta uma lista de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Retorna todas as listas de e-mail paginadas para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getPaginatedForUser(int $userId, int $perPage = 15): LengthAwarePaginator;
}
