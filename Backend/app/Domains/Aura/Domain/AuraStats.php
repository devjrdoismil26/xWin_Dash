<?php

namespace App\Domains\Aura\Domain;

class AuraStats
{
    /**
     * @param array<string, mixed> $metrics
     */
    public function __construct(
        public readonly string $id,
        public readonly string $connectionId,
        public readonly string $date,
        public readonly int $messagesReceived = 0,
        public readonly int $messagesSent = 0,
        public readonly int $activeChats = 0,
        public readonly array $metrics = [],
        public readonly ?\DateTime $createdAt = null,
        public readonly ?\DateTime $updatedAt = null,
    ) {
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'],
            connectionId: $data['connection_id'],
            date: $data['date'],
            messagesReceived: $data['messages_received'] ?? 0,
            messagesSent: $data['messages_sent'] ?? 0,
            activeChats: $data['active_chats'] ?? 0,
            metrics: $data['metrics'] ?? [],
            createdAt: isset($data['created_at']) ? new \DateTime($data['created_at']) : null,
            updatedAt: isset($data['updated_at']) ? new \DateTime($data['updated_at']) : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'connection_id' => $this->connectionId,
            'date' => $this->date,
            'messages_received' => $this->messagesReceived,
            'messages_sent' => $this->messagesSent,
            'active_chats' => $this->activeChats,
            'metrics' => $this->metrics,
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }
}
