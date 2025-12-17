<?php

namespace App\Domains\Workflows\ValueObjects;

class CustomWebhookNodeConfig
{
    public function __construct(
        public readonly string $url,
        public readonly string $method = 'POST',
        public readonly array $headers = [],
        public readonly array $payload = [],
        public readonly ?string $secret = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['url'],
            $data['method'] ?? 'POST',
            $data['headers'] ?? [],
            $data['payload'] ?? [],
            $data['secret'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'url' => $this->url,
            'method' => $this->method,
            'headers' => $this->headers,
            'payload' => $this->payload,
            'secret' => $this->secret,
        ];
    }
}
