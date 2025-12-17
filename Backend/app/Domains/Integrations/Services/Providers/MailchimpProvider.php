<?php

namespace App\Domains\Integrations\Services\Providers;

class MailchimpProvider extends BaseProvider
{
    public function testConnection(): array
    {
        $credentials = $this->getCredentials();
        
        if (!$credentials || !isset($credentials['api_key'])) {
            throw new \Exception('Missing API key');
        }

        $dc = explode('-', $credentials['api_key'])[1] ?? 'us1';
        
        $response = $this->makeRequest('get', "https://{$dc}.api.mailchimp.com/3.0/", [
            'headers' => ['Authorization' => 'Bearer ' . $credentials['api_key']]
        ]);

        return [
            'account_id' => $response['account_id'] ?? null,
            'account_name' => $response['account_name'] ?? null
        ];
    }

    public function sync(): array
    {
        try {
            $credentials = $this->getCredentials();
            
            if (!$credentials || !isset($credentials['api_key'])) {
                throw new \Exception('Missing API key');
            }

            $dc = explode('-', $credentials['api_key'])[1] ?? 'us1';
            $baseUrl = "https://{$dc}.api.mailchimp.com/3.0";
            $syncedCount = 0;
            $syncedData = [];

            // Sincronizar listas
            $lists = $this->syncLists($baseUrl, $credentials);
            $syncedCount += count($lists);
            $syncedData['lists'] = $lists;

            // Sincronizar contatos (membros) de cada lista
            $totalContacts = 0;
            foreach ($lists as $list) {
                $contacts = $this->syncListContacts($baseUrl, $credentials, $list['id']);
                $totalContacts += count($contacts);
            }
            $syncedCount += $totalContacts;
            $syncedData['contacts'] = $totalContacts;

            // Sincronizar campanhas
            $campaigns = $this->syncCampaigns($baseUrl, $credentials);
            $syncedCount += count($campaigns);
            $syncedData['campaigns'] = $campaigns;

            return [
                'count' => $syncedCount,
                'message' => "Sincronizados {$syncedCount} itens do Mailchimp",
                'data' => $syncedData
            ];
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Mailchimp sync failed', [
                'error' => $e->getMessage()
            ]);
            return [
                'count' => 0,
                'message' => 'Erro ao sincronizar Mailchimp: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Sincroniza listas do Mailchimp
     */
    protected function syncLists(string $baseUrl, array $credentials): array
    {
        try {
            $response = $this->makeRequest('get', $baseUrl . '/lists', [
                'headers' => ['Authorization' => 'Bearer ' . $credentials['api_key']],
                'params' => ['count' => 1000]
            ]);

            $lists = $response['lists'] ?? [];
            
            foreach ($lists as $list) {
                \DB::table('integrations_sync_data')->updateOrInsert(
                    [
                        'provider' => 'mailchimp',
                        'external_id' => $list['id'],
                        'type' => 'list'
                    ],
                    [
                        'data' => json_encode($list),
                        'synced_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }

            return $lists;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Mailchimp lists sync failed: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Sincroniza contatos de uma lista
     */
    protected function syncListContacts(string $baseUrl, array $credentials, string $listId): array
    {
        try {
            $response = $this->makeRequest('get', $baseUrl . "/lists/{$listId}/members", [
                'headers' => ['Authorization' => 'Bearer ' . $credentials['api_key']],
                'params' => ['count' => 1000]
            ]);

            $members = $response['members'] ?? [];
            
            foreach ($members as $member) {
                \DB::table('integrations_sync_data')->updateOrInsert(
                    [
                        'provider' => 'mailchimp',
                        'external_id' => $member['id'],
                        'type' => 'contact'
                    ],
                    [
                        'data' => json_encode($member),
                        'synced_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }

            return $members;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning("Mailchimp contacts sync failed for list {$listId}: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Sincroniza campanhas do Mailchimp
     */
    protected function syncCampaigns(string $baseUrl, array $credentials): array
    {
        try {
            $response = $this->makeRequest('get', $baseUrl . '/campaigns', [
                'headers' => ['Authorization' => 'Bearer ' . $credentials['api_key']],
                'params' => ['count' => 1000]
            ]);

            $campaigns = $response['campaigns'] ?? [];
            
            foreach ($campaigns as $campaign) {
                \DB::table('integrations_sync_data')->updateOrInsert(
                    [
                        'provider' => 'mailchimp',
                        'external_id' => $campaign['id'],
                        'type' => 'campaign'
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
            \Illuminate\Support\Facades\Log::warning('Mailchimp campaigns sync failed: ' . $e->getMessage());
            return [];
        }
    }

    public function getAuthUrl(): string
    {
        return 'https://login.mailchimp.com/oauth2/authorize?' . http_build_query([
            'response_type' => 'code',
            'client_id' => config('services.mailchimp.client_id'),
            'redirect_uri' => config('services.mailchimp.redirect_uri')
        ]);
    }

    public function handleCallback(array $params): array
    {
        if (!isset($params['code'])) {
            throw new \Exception('Authorization code not provided');
        }

        $response = $this->makeRequest('post', 'https://login.mailchimp.com/oauth2/token', [
            'grant_type' => 'authorization_code',
            'client_id' => config('services.mailchimp.client_id'),
            'client_secret' => config('services.mailchimp.client_secret'),
            'redirect_uri' => config('services.mailchimp.redirect_uri'),
            'code' => $params['code']
        ]);

        return [
            'access_token' => $response['access_token']
        ];
    }
}
