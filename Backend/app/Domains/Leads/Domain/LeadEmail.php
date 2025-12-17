<?php

namespace App\Domains\Leads\Domain;

class LeadEmail
{
    public ?int $id;

    public int $leadId;

    public string $subject;

    public string $body;

    public ?\DateTime $sentAt;

    public ?\DateTime $openedAt;

    public ?\DateTime $clickedAt;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $leadId,
        string $subject,
        string $body,
        ?\DateTime $sentAt = null,
        ?\DateTime $openedAt = null,
        ?\DateTime $clickedAt = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->leadId = $leadId;
        $this->subject = $subject;
        $this->body = $body;
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
            $data['lead_id'],
            $data['subject'],
            $data['body'],
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
            'lead_id' => $this->leadId,
            'subject' => $this->subject,
            'body' => $this->body,
            'sent_at' => $this->sentAt ? $this->sentAt->format('Y-m-d H:i:s') : null,
            'opened_at' => $this->openedAt ? $this->openedAt->format('Y-m-d H:i:s') : null,
            'clicked_at' => $this->clickedAt ? $this->clickedAt->format('Y-m-d H:i:s') : null,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
