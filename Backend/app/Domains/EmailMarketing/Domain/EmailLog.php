<?php

namespace App\Domains\EmailMarketing\Domain;

class EmailLog
{
    public ?int $id;

    public int $campaignId;

    public int $subscriberId;

    public string $status;

    public ?string $messageId;

    public ?string $errorMessage;

    public ?\DateTime $sentAt;

    public ?\DateTime $openedAt;

    public ?\DateTime $clickedAt;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $campaignId,
        int $subscriberId,
        string $status,
        ?string $messageId = null,
        ?string $errorMessage = null,
        ?\DateTime $sentAt = null,
        ?\DateTime $openedAt = null,
        ?\DateTime $clickedAt = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->campaignId = $campaignId;
        $this->subscriberId = $subscriberId;
        $this->status = $status;
        $this->messageId = $messageId;
        $this->errorMessage = $errorMessage;
        $this->sentAt = $sentAt;
        $this->openedAt = $openedAt;
        $this->clickedAt = $clickedAt;
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
            $data['subscriber_id'],
            $data['status'],
            $data['message_id'] ?? null,
            $data['error_message'] ?? null,
            isset($data['sent_at']) ? new \DateTime($data['sent_at']) : null,
            isset($data['opened_at']) ? new \DateTime($data['opened_at']) : null,
            isset($data['clicked_at']) ? new \DateTime($data['clicked_at']) : null,
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
            'subscriber_id' => $this->subscriberId,
            'status' => $this->status,
            'message_id' => $this->messageId,
            'error_message' => $this->errorMessage,
            'sent_at' => $this->sentAt ? $this->sentAt->format('Y-m-d H:i:s') : null,
            'opened_at' => $this->openedAt ? $this->openedAt->format('Y-m-d H:i:s') : null,
            'clicked_at' => $this->clickedAt ? $this->clickedAt->format('Y-m-d H:i:s') : null,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
