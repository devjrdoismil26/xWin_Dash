<?php

namespace App\Domains\EmailMarketing\Domain;

interface EmailLogRepositoryInterface
{
    /**
     * Cria um novo log de e-mail.
     *
     * @param array $data
     *
     * @return EmailLog
     */
    public function create(array $data): EmailLog;

    /**
     * Encontra um log de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailLog|null
     */
    public function find(int $id): ?EmailLog;

    /**
     * Retorna logs de e-mail para uma campanha específica.
     *
     * @param int $campaignId
     *
     * @return array<EmailLog>
     */
    public function getByCampaignId(int $campaignId): array;

    /**
     * Atualiza o status de um log de e-mail.
     *
     * @param int         $id
     * @param string      $status
     * @param string|null $errorMessage
     *
     * @return EmailLog
     */
    public function updateStatus(int $id, string $status, ?string $errorMessage = null): EmailLog;
}
