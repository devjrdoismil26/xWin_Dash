<?php

namespace App\Domains\Integrations\Services\Providers;

class WebhookProvider extends BaseProvider
{
    public function testConnection(): array
    {
        $url = $this->config['webhook_url'] ?? null;
        
        if (!$url) {
            throw new \Exception('Webhook URL not configured');
        }

        try {
            $response = $this->makeRequest('post', $url, [
                'test' => true,
                'timestamp' => time()
            ]);

            return ['status' => 'reachable', 'response' => $response];
        } catch (\Exception $e) {
            throw new \Exception('Webhook unreachable: ' . $e->getMessage());
        }
    }

    public function sync(): array
    {
        return ['count' => 0, 'message' => 'Webhook sync not applicable'];
    }

    public function getAuthUrl(): string
    {
        return '';
    }

    public function handleCallback(array $params): array
    {
        return [];
    }
}
