<?php

namespace App\Domains\Aura\ValueObjects;

class RealTimeEvent
{
    public function __construct(
        public readonly string $type,
        public readonly string $entityId,
        public readonly array $payload,
        public readonly string $timestamp
    ) {}

    public static function messageReceived(string $chatId, array $message): self
    {
        return new self('message.received', $chatId, $message, now()->toIso8601String());
    }

    public static function messageSent(string $chatId, array $message): self
    {
        return new self('message.sent', $chatId, $message, now()->toIso8601String());
    }

    public static function chatStatusChanged(string $chatId, string $status): self
    {
        return new self('chat.status_changed', $chatId, ['status' => $status], now()->toIso8601String());
    }

    public static function connectionStatusChanged(string $connectionId, string $status): self
    {
        return new self('connection.status_changed', $connectionId, ['status' => $status], now()->toIso8601String());
    }

    public function toArray(): array
    {
        return [
            'type' => $this->type,
            'entity_id' => $this->entityId,
            'payload' => $this->payload,
            'timestamp' => $this->timestamp,
        ];
    }
}
