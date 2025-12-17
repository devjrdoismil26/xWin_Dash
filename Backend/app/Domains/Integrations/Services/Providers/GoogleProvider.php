<?php

namespace App\Domains\Integrations\Services\Providers;

class GoogleProvider extends BaseProvider
{
    public function testConnection(): array
    {
        $credentials = $this->getCredentials();
        
        if (!$credentials || !isset($credentials['access_token'])) {
            throw new \Exception('Missing access token');
        }

        $response = $this->makeRequest('get', 'https://www.googleapis.com/oauth2/v1/userinfo', [
            'headers' => ['Authorization' => 'Bearer ' . $credentials['access_token']]
        ]);

        return [
            'user' => $response['email'] ?? null,
            'verified' => $response['verified_email'] ?? false
        ];
    }

    public function sync(): array
    {
        try {
            $credentials = $this->getCredentials();
            
            if (!$credentials || !isset($credentials['access_token'])) {
                throw new \Exception('Missing access token');
            }

            $syncedCount = 0;
            $syncedData = [];

            // Sincronizar Analytics (se scope permitir)
            if ($this->hasScope($credentials, 'analytics')) {
                $analytics = $this->syncAnalytics($credentials);
                $syncedCount += count($analytics);
                $syncedData['analytics'] = $analytics;
            }

            // Sincronizar Google Ads (se scope permitir)
            if ($this->hasScope($credentials, 'ads')) {
                $ads = $this->syncAds($credentials);
                $syncedCount += count($ads);
                $syncedData['ads'] = $ads;
            }

            // Sincronizar contatos do Google (se scope permitir)
            if ($this->hasScope($credentials, 'contacts')) {
                $contacts = $this->syncContacts($credentials);
                $syncedCount += count($contacts);
                $syncedData['contacts'] = $contacts;
            }

            return [
                'count' => $syncedCount,
                'message' => "Sincronizados {$syncedCount} itens do Google",
                'data' => $syncedData
            ];
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Google sync failed', [
                'error' => $e->getMessage()
            ]);
            return [
                'count' => 0,
                'message' => 'Erro ao sincronizar Google: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Verifica se credentials têm scope específico
     */
    protected function hasScope(array $credentials, string $scope): bool
    {
        $scopes = $credentials['scopes'] ?? [];
        return in_array($scope, $scopes) || in_array('all', $scopes);
    }

    /**
     * Sincroniza Google Analytics
     */
    protected function syncAnalytics(array $credentials): array
    {
        try {
            // Buscar propriedades do Analytics
            $response = $this->makeRequest('get', 'https://analyticsreporting.googleapis.com/v4/reports:batchGet', [
                'headers' => ['Authorization' => 'Bearer ' . $credentials['access_token']],
                'json' => [
                    'reportRequests' => [
                        [
                            'viewId' => $credentials['view_id'] ?? 'ga:123456789',
                            'dateRanges' => [
                                ['startDate' => '30daysAgo', 'endDate' => 'today']
                            ],
                            'metrics' => [
                                ['expression' => 'ga:sessions'],
                                ['expression' => 'ga:users']
                            ]
                        ]
                    ]
                ]
            ]);

            $reports = $response['reports'] ?? [];
            
            foreach ($reports as $report) {
                \DB::table('integrations_sync_data')->updateOrInsert(
                    [
                        'provider' => 'google',
                        'external_id' => 'analytics_' . uniqid(),
                        'type' => 'analytics'
                    ],
                    [
                        'data' => json_encode($report),
                        'synced_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }

            return $reports;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Google Analytics sync failed: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Sincroniza Google Ads
     */
    protected function syncAds(array $credentials): array
    {
        try {
            // Integrar com ADStool module
            $customerId = $credentials['customer_id'] ?? null;
            
            if (!$customerId) {
                return [];
            }

            // Usar GoogleAdsIntegrationService para buscar campanhas
            $adsService = app(\App\Domains\ADStool\Services\GoogleAdsIntegrationService::class);
            $campaigns = $adsService->listCampaigns();

            foreach ($campaigns as $campaign) {
                \DB::table('integrations_sync_data')->updateOrInsert(
                    [
                        'provider' => 'google',
                        'external_id' => $campaign['id'],
                        'type' => 'ads_campaign'
                    ],
                    [
                        'data' => json_encode($campaign),
                        'synced_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }

            return $campaigns;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Google Ads sync failed: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Sincroniza contatos do Google
     */
    protected function syncContacts(array $credentials): array
    {
        try {
            $response = $this->makeRequest('get', 'https://people.googleapis.com/v1/people/me/connections', [
                'headers' => ['Authorization' => 'Bearer ' . $credentials['access_token']],
                'params' => ['personFields' => 'names,emailAddresses,phoneNumbers']
            ]);

            $contacts = $response['connections'] ?? [];
            
            foreach ($contacts as $contact) {
                $contactId = $contact['resourceName'] ?? uniqid();
                \DB::table('integrations_sync_data')->updateOrInsert(
                    [
                        'provider' => 'google',
                        'external_id' => $contactId,
                        'type' => 'contact'
                    ],
                    [
                        'data' => json_encode($contact),
                        'synced_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }

            return $contacts;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Google Contacts sync failed: ' . $e->getMessage());
            return [];
        }
    }

    public function getAuthUrl(): string
    {
        $params = http_build_query([
            'client_id' => config('services.google.client_id'),
            'redirect_uri' => config('services.google.redirect_uri'),
            'response_type' => 'code',
            'scope' => 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email',
            'access_type' => 'offline',
            'prompt' => 'consent'
        ]);

        return 'https://accounts.google.com/o/oauth2/v2/auth?' . $params;
    }

    public function handleCallback(array $params): array
    {
        if (!isset($params['code'])) {
            throw new \Exception('Authorization code not provided');
        }

        $response = $this->makeRequest('post', 'https://oauth2.googleapis.com/token', [
            'code' => $params['code'],
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'redirect_uri' => config('services.google.redirect_uri'),
            'grant_type' => 'authorization_code'
        ]);

        return [
            'access_token' => $response['access_token'],
            'refresh_token' => $response['refresh_token'] ?? null,
            'expires_in' => $response['expires_in'] ?? 3600
        ];
    }
}
