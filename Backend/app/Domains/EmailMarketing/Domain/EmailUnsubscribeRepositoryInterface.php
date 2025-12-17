<?php

namespace App\Domains\EmailMarketing\Domain;

interface EmailUnsubscribeRepositoryInterface
{
    /**
     * Registra um novo cancelamento de inscrição.
     *
     * @param array $data
     *
     * @return EmailUnsubscribe
     */
    public function create(array $data): EmailUnsubscribe;

    /**
     * Encontra um registro de cancelamento de inscrição pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailUnsubscribe|null
     */
    public function find(int $id): ?EmailUnsubscribe;

    /**
     * Verifica se um e-mail está cancelado para uma lista específica.
     *
     * @param string   $email
     * @param int|null $emailListId
     *
     * @return bool
     */
    public function isEmailUnsubscribed(string $email, ?int $emailListId = null): bool;
}
