<?php

namespace App\Domains\Core\Domain;

class IntegrationSyncLog
{
    public ?int $id;

    public int $integrationId;

    public string $status;

    public ?string $message;

    /** @var array<string, mixed>|null */
    public ?array $details;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    /**
     * @param int $integrationId
     * @param string $status
     * @param string|null $message
     * @param array<string, mixed>|null $details
     * @param int|null $id
     * @param \DateTime|null $createdAt
     * @param \DateTime|null $updatedAt
     */
    public function __construct(
        int $integrationId,
        string $status,
        ?string $message = null,
        ?array $details = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->integrationId = $integrationId;
        $this->status = $status;
        $this->message = $message;
        $this->details = $details;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    /**
     * Cria uma instância da entidade a partir de um array de dados (ex: vindo do repositório).
     *
     * @param array<string, mixed> $data
     *
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['integration_id'],
            $data['status'],
            $data['message'] ?? null,
            $data['details'] ?? null,
            $data['id'] ?? null,
            isset($data['created_at']) ? new \DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new \DateTime($data['updated_at']) : null,
        );
    }

    /**
     * Converte a entidade para um array.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'integration_id' => $this->integrationId,
            'status' => $this->status,
            'message' => $this->message,
            'details' => $this->details,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
