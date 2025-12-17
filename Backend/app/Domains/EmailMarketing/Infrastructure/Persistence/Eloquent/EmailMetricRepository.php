<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Domain\EmailMetric;
use App\Domains\EmailMarketing\Contracts\EmailMetricRepositoryInterface;

class EmailMetricRepository implements EmailMetricRepositoryInterface
{
    protected EmailMetricModel $model;

    public function __construct(EmailMetricModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria uma nova métrica de e-mail.
     *
     * @param array $data
     *
     * @return EmailMetric
     */
    public function create(array $data): EmailMetric
    {
        $metricModel = $this->model->create($data);
        return EmailMetric::fromArray($metricModel->toArray());
    }

    /**
     * Encontra uma métrica de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailMetric|null
     */
    public function find(int $id): ?EmailMetric
    {
        $metricModel = $this->model->find($id);
        return $metricModel ? EmailMetric::fromArray($metricModel->toArray()) : null;
    }

    /**
     * Retorna métricas para um log de e-mail específico.
     *
     * @param int $emailLogId
     *
     * @return array<EmailMetric>
     */
    public function getByEmailLogId(int $emailLogId): array
    {
        return $this->model->where('email_log_id', $emailLogId)
                           ->get()
                           ->map(function ($item) {
                               return EmailMetric::fromArray($item->toArray());
                           })->toArray();
    }
}
