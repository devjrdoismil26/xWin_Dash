<?php

namespace App\Domains\Workflows\ValueObjects;

class ApiCallNodeConfig
{
    public function __construct(
        public readonly string $url,
        public readonly string $method = 'GET',
        public readonly array $headers = [],
        public readonly ?array $body = null,
        public readonly ?int $timeout = 30
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['url'],
            $data['method'] ?? 'GET',
            $data['headers'] ?? [],
            $data['body'] ?? null,
            $data['timeout'] ?? 30
        );
    }

    public function toArray(): array
    {
        return [
            'url' => $this->url,
            'method' => $this->method,
            'headers' => $this->headers,
            'body' => $this->body,
            'timeout' => $this->timeout,
        ];
    }
}
