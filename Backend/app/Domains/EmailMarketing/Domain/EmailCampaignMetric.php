<?php

namespace App\Domains\EmailMarketing\Domain;

class EmailCampaignMetric
{
    public ?int $id;

    public int $campaignId;

    public string $metricType;

    public int $value;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $campaignId,
        string $metricType,
        int $value,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->campaignId = $campaignId;
        $this->metricType = $metricType;
        $this->value = $value;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    /**
     * Cria uma instância da entidade a partir de um array de dados (ex: vindo do repositório).
     *
     * @param array $data
     *
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['campaign_id'],
            $data['metric_type'],
            $data['value'],
            $data['id'] ?? null,
            isset($data['created_at']) ? new \DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new \DateTime($data['updated_at']) : null,
        );
    }

    /**
     * Converte a entidade para um array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'campaign_id' => $this->campaignId,
            'metric_type' => $this->metricType,
            'value' => $this->value,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
