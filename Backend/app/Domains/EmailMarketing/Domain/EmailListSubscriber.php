<?php

namespace App\Domains\EmailMarketing\Domain;

class EmailListSubscriber
{
    public ?int $id;

    public int $emailListId;

    public int $emailSubscriberId;

    public ?\DateTime $subscribedAt;

    public ?\DateTime $unsubscribedAt;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $emailListId,
        int $emailSubscriberId,
        ?\DateTime $subscribedAt = null,
        ?\DateTime $unsubscribedAt = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->emailListId = $emailListId;
        $this->emailSubscriberId = $emailSubscriberId;
        $this->subscribedAt = $subscribedAt ?? new \DateTime();
        $this->unsubscribedAt = $unsubscribedAt;
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
            $data['email_list_id'],
            $data['email_subscriber_id'],
            isset($data['subscribed_at']) ? new \DateTime($data['subscribed_at']) : null,
            isset($data['unsubscribed_at']) ? new \DateTime($data['unsubscribed_at']) : null,
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
            'email_list_id' => $this->emailListId,
            'email_subscriber_id' => $this->emailSubscriberId,
            'subscribed_at' => $this->subscribedAt ? $this->subscribedAt->format('Y-m-d H:i:s') : null,
            'unsubscribed_at' => $this->unsubscribedAt ? $this->unsubscribedAt->format('Y-m-d H:i:s') : null,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
