<?php

namespace App\Shared\Events;

use DateTime;
use JsonSerializable;

abstract class BaseDomainEvent implements JsonSerializable
{
    public readonly string $eventId;
    public readonly string $eventType;
    public readonly DateTime $occurredAt;
    public readonly array $payload;
    public readonly ?int $userId;
    public readonly ?int $projectId;
    public readonly ?array $metadata;

    public function __construct(
        array $payload,
        ?int $userId = null,
        ?int $projectId = null,
        ?array $metadata = null,
        ?string $eventId = null,
        ?DateTime $occurredAt = null
    ) {
        $this->eventId = $eventId ?? uniqid('event_', true);
        $this->eventType = static::getEventType();
        $this->occurredAt = $occurredAt ?? new DateTime();
        $this->payload = $payload;
        $this->userId = $userId;
        $this->projectId = $projectId;
        $this->metadata = $metadata;
    }

    abstract public static function getEventType(): string;

    public function toArray(): array
    {
        return [
            'event_id' => $this->eventId,
            'event_type' => $this->eventType,
            'occurred_at' => $this->occurredAt->format('Y-m-d H:i:s'),
            'payload' => $this->payload,
            'user_id' => $this->userId,
            'project_id' => $this->projectId,
            'metadata' => $this->metadata,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }

    public function getPayloadValue(string $key, mixed $default = null): mixed
    {
        return $this->payload[$key] ?? $default;
    }

    public function hasPayloadKey(string $key): bool
    {
        return array_key_exists($key, $this->payload);
    }

    public function isUserEvent(): bool
    {
        return $this->userId !== null;
    }

    public function isProjectEvent(): bool
    {
        return $this->projectId !== null;
    }

    public function getAgeInSeconds(): int
    {
        return (new DateTime())->getTimestamp() - $this->occurredAt->getTimestamp();
    }

    public function getAgeInMinutes(): int
    {
        return intval($this->getAgeInSeconds() / 60);
    }

    public function isRecent(int $seconds = 300): bool
    {
        return $this->getAgeInSeconds() <= $seconds;
    }
}