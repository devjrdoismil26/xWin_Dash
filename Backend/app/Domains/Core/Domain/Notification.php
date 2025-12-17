<?php

namespace App\Domains\Core\Domain;

class Notification
{
    public ?string $id;

    public string $userId;

    public string $message;

    public string $type;

    public ?string $link;

    public bool $read;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        string $userId,
        string $message,
        string $type = 'info',
        ?string $link = null,
        bool $read = false,
        ?string $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->userId = $userId;
        $this->message = $message;
        $this->type = $type;
        $this->link = $link;
        $this->read = $read;
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
            (string)$data['user_id'],
            $data['message'],
            $data['type'] ?? 'info',
            $data['link'] ?? null,
            (bool)($data['read'] ?? false),
            (string)($data['id'] ?? null),
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
            'user_id' => $this->userId,
            'message' => $this->message,
            'type' => $this->type,
            'link' => $this->link,
            'read' => $this->read,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }

    /**
     * Marca a notificação como lida.
     */
    public function markAsRead(): void
    {
        $this->read = true;
    }
}
