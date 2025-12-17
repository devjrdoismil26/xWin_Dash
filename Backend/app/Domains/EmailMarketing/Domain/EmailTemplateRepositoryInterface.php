<?php

namespace App\Domains\EmailMarketing\Domain;

// Supondo que a entidade de domínio exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EmailTemplateRepositoryInterface
{
    /**
     * Cria um novo template de e-mail.
     *
     * @param array $data
     *
     * @return EmailTemplate
     */
    public function create(array $data): EmailTemplate;

    /**
     * Encontra um template de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailTemplate|null
     */
    public function find(int $id): ?EmailTemplate;

    /**
     * Atualiza um template de e-mail existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return EmailTemplate
     */
    public function update(int $id, array $data): EmailTemplate;

    /**
     * Deleta um template de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Retorna todos os templates de e-mail paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getPaginatedForUser(int $userId, int $perPage = 15): LengthAwarePaginator;
}
