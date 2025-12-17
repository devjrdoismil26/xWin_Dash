<?php

namespace App\Domains\Leads\Domain;

interface LeadEmailRepositoryInterface
{
    /**
     * Cria um novo e-mail de Lead.
     *
     * @param array $data
     *
     * @return LeadEmail
     */
    public function create(array $data): LeadEmail;

    /**
     * Encontra um e-mail de Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return LeadEmail|null
     */
    public function find(int $id): ?LeadEmail;

    /**
     * Retorna todos os e-mails para um Lead específico.
     *
     * @param int $leadId
     *
     * @return array<LeadEmail>
     */
    public function getByLeadId(int $leadId): array;

    /**
     * Marca um e-mail como aberto.
     *
     * @param int $id
     *
     * @return bool
     */
    public function markAsOpened(int $id): bool;

    /**
     * Marca um e-mail como clicado.
     *
     * @param int $id
     *
     * @return bool
     */
    public function markAsClicked(int $id): bool;
}
