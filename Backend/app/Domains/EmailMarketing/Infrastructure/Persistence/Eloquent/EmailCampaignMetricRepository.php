<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Domain\EmailCampaignMetric;
use App\Domains\EmailMarketing\Domain\EmailCampaignMetricRepositoryInterface;

class EmailCampaignMetricRepository implements EmailCampaignMetricRepositoryInterface
{
    protected EmailCampaignMetricModel $model;

    public function __construct(EmailCampaignMetricModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria uma nova métrica de campanha de e-mail.
     *
     * @param array $data
     *
     * @return EmailCampaignMetric
     */
    public function create(array $data): EmailCampaignMetric
    {
        $metricModel = $this->model->create($data);
        return EmailCampaignMetric::fromArray($metricModel->toArray());
    }

    /**
     * Encontra uma métrica de campanha de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailCampaignMetric|null
     */
    public function find(int $id): ?EmailCampaignMetric
    {
        $metricModel = $this->model->find($id);
        return $metricModel ? EmailCampaignMetric::fromArray($metricModel->toArray()) : null;
    }

    /**
     * Retorna métricas para uma campanha específica.
     *
     * @param int $campaignId
     *
     * @return array<EmailCampaignMetric>
     */
    public function getByCampaignId(int $campaignId): array
    {
        return $this->model->where('campaign_id', $campaignId)
                           ->get()
                           ->map(function ($item) {
                               return EmailCampaignMetric::fromArray($item->toArray());
                           })->toArray();
    }

    /**
     * Atualiza uma métrica existente ou a cria se não existir.
     *
     * @param int    $campaignId
     * @param string $metricType
     * @param int    $value
     *
     * @return EmailCampaignMetric
     */
    public function updateOrCreate(int $campaignId, string $metricType, int $value): EmailCampaignMetric
    {
        $metricModel = $this->model->updateOrCreate(
            ['campaign_id' => $campaignId, 'metric_type' => $metricType],
            ['value' => $value],
        );
        return EmailCampaignMetric::fromArray($metricModel->toArray());
    }
}
