<?php

namespace App\Domains\Aura\Domain;

class AuraUraSession
{
    /**
     * @param array<string, mixed> $context
     * @param array<string, mixed> $history
     */
    public function __construct(
        public readonly string $id,
        public readonly string $chatId,
        public readonly string $sessionId,
        public readonly array $context = [],
        public readonly array $history = [],
        public readonly string $status = 'active',
        public readonly ?\DateTime $startedAt = null,
        public readonly ?\DateTime $endedAt = null,
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
            chatId: $data['chat_id'],
            sessionId: $data['session_id'],
            context: $data['context'] ?? [],
            history: $data['history'] ?? [],
            status: $data['status'] ?? 'active',
            startedAt: isset($data['started_at']) ? new \DateTime($data['started_at']) : null,
            endedAt: isset($data['ended_at']) ? new \DateTime($data['ended_at']) : null,
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
            'chat_id' => $this->chatId,
            'session_id' => $this->sessionId,
            'context' => $this->context,
            'history' => $this->history,
            'status' => $this->status,
            'started_at' => $this->startedAt?->format('Y-m-d H:i:s'),
            'ended_at' => $this->endedAt?->format('Y-m-d H:i:s'),
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }
}
