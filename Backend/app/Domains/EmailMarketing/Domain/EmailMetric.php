<?php

namespace App\Domains\EmailMarketing\Domain;

class EmailMetric
{
    public ?int $id;

    public int $emailLogId;

    public string $metricType;

    public ?\DateTime $occurredAt;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $emailLogId,
        string $metricType,
        ?\DateTime $occurredAt = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->emailLogId = $emailLogId;
        $this->metricType = $metricType;
        $this->occurredAt = $occurredAt ?? new \DateTime();
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
            $data['email_log_id'],
            $data['metric_type'],
            isset($data['occurred_at']) ? new \DateTime($data['occurred_at']) : null,
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
            'email_log_id' => $this->emailLogId,
            'metric_type' => $this->metricType,
            'occurred_at' => $this->occurredAt ? $this->occurredAt->format('Y-m-d H:i:s') : null,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
