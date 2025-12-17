<?php

namespace App\Domains\Integrations\Services;

use App\Domains\Integrations\Models\Integration;
use App\Domains\Integrations\Services\Providers\IntegrationProviderFactory;
use Illuminate\Support\Facades\Queue;

class IntegrationService
{
    public function __construct(
        private readonly IntegrationProviderFactory $providerFactory
    ) {}

    public function testConnection(Integration $integration): array
    {
        $startTime = microtime(true);

        try {
            $provider = $this->providerFactory->make($integration->provider, $integration);
            $result = $provider->testConnection();

            $duration = (microtime(true) - $startTime) * 1000;

            return [
                'success' => true,
                'message' => 'Connection successful',
                'provider' => $integration->provider,
                'duration_ms' => round($duration, 2),
                'details' => $result
            ];
        } catch (\Exception $e) {
            $duration = (microtime(true) - $startTime) * 1000;

            return [
                'success' => false,
                'message' => 'Connection failed',
                'error' => $e->getMessage(),
                'duration_ms' => round($duration, 2)
            ];
        }
    }

    public function queueSync(Integration $integration): string
    {
        $jobId = 'sync_' . $integration->id . '_' . time();

        Queue::push(function () use ($integration) {
            $this->performSync($integration);
        });

        return $jobId;
    }

    public function performSync(Integration $integration): array
    {
        $startTime = microtime(true);

        try {
            $provider = $this->providerFactory->make($integration->provider, $integration);
            $result = $provider->sync();

            $duration = (microtime(true) - $startTime) * 1000;

            $integration->markSynced();

            return [
                'success' => true,
                'records_processed' => $result['count'] ?? 0,
                'duration_ms' => round($duration, 2)
            ];
        } catch (\Exception $e) {
            $duration = (microtime(true) - $startTime) * 1000;

            $integration->recordError($e->getMessage());

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'duration_ms' => round($duration, 2)
            ];
        }
    }

    public function getProviderConfig(string $provider): array
    {
        return match($provider) {
            'google' => [
                'oauth_url' => 'https://accounts.google.com/o/oauth2/v2/auth',
                'token_url' => 'https://oauth2.googleapis.com/token',
                'scopes' => ['https://www.googleapis.com/auth/spreadsheets']
            ],
            'facebook' => [
                'oauth_url' => 'https://www.facebook.com/v18.0/dialog/oauth',
                'token_url' => 'https://graph.facebook.com/v18.0/oauth/access_token',
                'scopes' => ['ads_management', 'pages_manage_posts']
            ],
            'mailchimp' => [
                'oauth_url' => 'https://login.mailchimp.com/oauth2/authorize',
                'token_url' => 'https://login.mailchimp.com/oauth2/token',
                'scopes' => []
            ],
            default => []
        };
    }
}
