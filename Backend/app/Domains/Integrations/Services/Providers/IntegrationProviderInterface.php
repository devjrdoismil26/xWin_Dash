<?php

namespace App\Domains\Integrations\Services\Providers;

interface IntegrationProviderInterface
{
    public function testConnection(): array;
    public function sync(): array;
    public function getAuthUrl(): string;
    public function handleCallback(array $params): array;
}
