<?php

namespace App\Domains\EmailMarketing\Domain;

interface EmailMetricRepositoryInterface
{
    /**
     * Cria uma nova métrica de e-mail.
     *
     * @param array $data
     *
     * @return EmailMetric
     */
    public function create(array $data): EmailMetric;

    /**
     * Encontra uma métrica de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailMetric|null
     */
    public function find(int $id): ?EmailMetric;

    /**
     * Retorna métricas para um log de e-mail específico.
     *
     * @param int $emailLogId
     *
     * @return array<EmailMetric>
     */
    public function getByEmailLogId(int $emailLogId): array;
}
