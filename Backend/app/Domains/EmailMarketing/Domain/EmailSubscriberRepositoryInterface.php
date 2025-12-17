<?php

namespace App\Domains\EmailMarketing\Domain;

// Supondo que a entidade de domínio exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EmailSubscriberRepositoryInterface
{
    /**
     * Cria um novo assinante de e-mail.
     *
     * @param array $data
     *
     * @return EmailSubscriber
     */
    public function create(array $data): EmailSubscriber;

    /**
     * Encontra um assinante de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailSubscriber|null
     */
    public function find(int $id): ?EmailSubscriber;

    /**
     * Encontra um assinante de e-mail pelo seu endereço de e-mail.
     *
     * @param string $email
     *
     * @return EmailSubscriber|null
     */
    public function findByEmail(string $email): ?EmailSubscriber;

    /**
     * Atualiza um assinante de e-mail existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return EmailSubscriber
     */
    public function update(int $id, array $data): EmailSubscriber;

    /**
     * Deleta um assinante de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Retorna todos os assinantes de e-mail paginados.
     *
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator;
}
