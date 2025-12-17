<?php

namespace App\Domains\EmailMarketing\Domain;

class EmailLink
{
    public ?int $id;

    public int $campaignId;

    public string $originalUrl;

    public string $trackedUrl;

    public int $clicks;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $campaignId,
        string $originalUrl,
        string $trackedUrl,
        int $clicks = 0,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->campaignId = $campaignId;
        $this->originalUrl = $originalUrl;
        $this->trackedUrl = $trackedUrl;
        $this->clicks = $clicks;
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
            $data['original_url'],
            $data['tracked_url'],
            $data['clicks'] ?? 0,
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
            'original_url' => $this->originalUrl,
            'tracked_url' => $this->trackedUrl,
            'clicks' => $this->clicks,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
