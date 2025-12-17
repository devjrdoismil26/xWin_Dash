<?php

namespace App\Domains\EmailMarketing\Domain;

class EmailSubscriber
{
    public ?int $id;

    public string $email;

    public string $status; // Ex: 'subscribed', 'unsubscribed', 'bounced', 'pending'

    public ?string $name;

    public ?array $customFields;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        string $email,
        string $status = 'subscribed',
        ?string $name = null,
        ?array $customFields = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->email = $email;
        $this->status = $status;
        $this->name = $name;
        $this->customFields = $customFields;
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
            $data['status'] ?? 'subscribed',
            $data['name'] ?? null,
            $data['custom_fields'] ?? null,
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
            'status' => $this->status,
            'name' => $this->name,
            'custom_fields' => $this->customFields,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
