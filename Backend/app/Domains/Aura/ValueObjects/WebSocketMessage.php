<?php

namespace App\Domains\Aura\ValueObjects;

class WebSocketMessage
{
    public function __construct(
        public readonly string $event,
        public readonly array $data,
        public readonly ?string $channel = null,
        public readonly ?string $userId = null
    ) {}

    public static function create(string $event, array $data, ?string $channel = null): self
    {
        return new self($event, $data, $channel);
    }

    public function toArray(): array
    {
        return [
            'event' => $this->event,
            'data' => $this->data,
            'channel' => $this->channel,
            'user_id' => $this->userId,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    public function toJson(): string
    {
        return json_encode($this->toArray());
    }
}
