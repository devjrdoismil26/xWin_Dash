<?php

namespace App\Domains\EmailMarketing\Domain;

interface EmailCampaignMetricRepositoryInterface
{
    /**
     * Cria uma nova métrica de campanha de e-mail.
     *
     * @param array $data
     *
     * @return EmailCampaignMetric
     */
    public function create(array $data): EmailCampaignMetric;

    /**
     * Encontra uma métrica de campanha de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailCampaignMetric|null
     */
    public function find(int $id): ?EmailCampaignMetric;

    /**
     * Retorna métricas para uma campanha específica.
     *
     * @param int $campaignId
     *
     * @return array<EmailCampaignMetric>
     */
    public function getByCampaignId(int $campaignId): array;

    /**
     * Atualiza uma métrica existente ou a cria se não existir.
     *
     * @param int    $campaignId
     * @param string $metricType
     * @param int    $value
     *
     * @return EmailCampaignMetric
     */
    public function updateOrCreate(int $campaignId, string $metricType, int $value): EmailCampaignMetric;
}
