<?php

namespace App\Services\Contracts;

interface ExternalApiServiceInterface
{
    public function makeHttpCall(
        string $method,
        string $endpoint,
        array $data = [],
        array $headers = [],
        string $operationName = 'http_call'
    ): array;

    public function getPlatformName(): string;
    public function getBaseUrl(): string;
    public function getDefaultHeaders(): array;
}
