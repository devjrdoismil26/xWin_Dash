<?php

namespace App\Domains\EmailMarketing\Domain;

class EmailUnsubscribe
{
    public ?int $id;

    public string $email;

    public ?int $emailSubscriberId;

    public ?int $emailListId;

    public ?string $reason;

    public ?\DateTime $unsubscribedAt;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        string $email,
        ?int $emailSubscriberId = null,
        ?int $emailListId = null,
        ?string $reason = null,
        ?\DateTime $unsubscribedAt = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->email = $email;
        $this->emailSubscriberId = $emailSubscriberId;
        $this->emailListId = $emailListId;
        $this->reason = $reason;
        $this->unsubscribedAt = $unsubscribedAt ?? new \DateTime();
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
            $data['email'],
            $data['email_subscriber_id'] ?? null,
            $data['email_list_id'] ?? null,
            $data['reason'] ?? null,
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
            'email' => $this->email,
            'email_subscriber_id' => $this->emailSubscriberId,
            'email_list_id' => $this->emailListId,
            'reason' => $this->reason,
            'unsubscribed_at' => $this->unsubscribedAt ? $this->unsubscribedAt->format('Y-m-d H:i:s') : null,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
