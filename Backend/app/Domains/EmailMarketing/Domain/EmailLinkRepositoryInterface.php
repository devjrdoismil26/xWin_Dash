<?php

namespace App\Domains\EmailMarketing\Domain;

interface EmailLinkRepositoryInterface
{
    /**
     * Cria um novo link de e-mail.
     *
     * @param array $data
     *
     * @return EmailLink
     */
    public function create(array $data): EmailLink;

    /**
     * Encontra um link de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailLink|null
     */
    public function find(int $id): ?EmailLink;

    /**
     * Encontra um link de e-mail pela URL rastreada.
     *
     * @param string $trackedUrl
     *
     * @return EmailLink|null
     */
    public function findByTrackedUrl(string $trackedUrl): ?EmailLink;

    /**
     * Incrementa o contador de cliques de um link.
     *
     * @param int $id
     *
     * @return bool
     */
    public function incrementClicks(int $id): bool;
}
