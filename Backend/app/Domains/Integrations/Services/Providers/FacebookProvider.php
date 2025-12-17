<?php

namespace App\Domains\Integrations\Services\Providers;

class FacebookProvider extends BaseProvider
{
    public function testConnection(): array
    {
        $credentials = $this->getCredentials();
        
        if (!$credentials || !isset($credentials['access_token'])) {
            throw new \Exception('Missing access token');
        }

        $response = $this->makeRequest('get', 'https://graph.facebook.com/v18.0/me', [
            'query' => ['access_token' => $credentials['access_token']]
        ]);

        return [
            'user_id' => $response['id'] ?? null,
            'name' => $response['name'] ?? null
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

            // Sincronizar páginas
            $pages = $this->syncPages($credentials);
            $syncedCount += count($pages);
            $syncedData['pages'] = $pages;

            // Sincronizar posts de cada página
            $totalPosts = 0;
            foreach ($pages as $page) {
                $posts = $this->syncPagePosts($credentials, $page['id']);
                $totalPosts += count($posts);
            }
            $syncedCount += $totalPosts;
            $syncedData['posts'] = $totalPosts;

            // Sincronizar métricas
            $metrics = $this->syncMetrics($credentials);
            $syncedCount += count($metrics);
            $syncedData['metrics'] = $metrics;

            return [
                'count' => $syncedCount,
                'message' => "Sincronizados {$syncedCount} itens do Facebook",
                'data' => $syncedData
            ];
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Facebook sync failed', [
                'error' => $e->getMessage()
            ]);
            return [
                'count' => 0,
                'message' => 'Erro ao sincronizar Facebook: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Sincroniza páginas do Facebook
     */
    protected function syncPages(array $credentials): array
    {
        try {
            $response = $this->makeRequest('get', 'https://graph.facebook.com/v18.0/me/accounts', [
                'query' => ['access_token' => $credentials['access_token']]
            ]);

            $pages = $response['data'] ?? [];
            
            foreach ($pages as $page) {
                \DB::table('integrations_sync_data')->updateOrInsert(
                    [
                        'provider' => 'facebook',
                        'external_id' => $page['id'],
                        'type' => 'page'
                    ],
                    [
                        'data' => json_encode($page),
                        'synced_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }

            return $pages;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Facebook pages sync failed: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Sincroniza posts de uma página
     */
    protected function syncPagePosts(array $credentials, string $pageId): array
    {
        try {
            $response = $this->makeRequest('get', "https://graph.facebook.com/v18.0/{$pageId}/posts", [
                'query' => [
                    'access_token' => $credentials['access_token'],
                    'limit' => 100
                ]
            ]);

            $posts = $response['data'] ?? [];
            
            foreach ($posts as $post) {
                \DB::table('integrations_sync_data')->updateOrInsert(
                    [
                        'provider' => 'facebook',
                        'external_id' => $post['id'],
                        'type' => 'post'
                    ],
                    [
                        'data' => json_encode($post),
                        'synced_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }

            return $posts;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning("Facebook posts sync failed for page {$pageId}: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Sincroniza métricas do Facebook
     */
    protected function syncMetrics(array $credentials): array
    {
        try {
            // Buscar insights das páginas
            $pages = $this->syncPages($credentials);
            $metrics = [];

            foreach ($pages as $page) {
                $response = $this->makeRequest('get', "https://graph.facebook.com/v18.0/{$page['id']}/insights", [
                    'query' => [
                        'access_token' => $credentials['access_token'],
                        'metric' => 'page_fans,page_impressions,page_engaged_users',
                        'period' => 'day'
                    ]
                ]);

                $insights = $response['data'] ?? [];
                $metrics = array_merge($metrics, $insights);
            }

            return $metrics;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Facebook metrics sync failed: ' . $e->getMessage());
            return [];
        }
    }

    public function getAuthUrl(): string
    {
        $params = http_build_query([
            'client_id' => config('services.facebook.client_id'),
            'redirect_uri' => config('services.facebook.redirect_uri'),
            'scope' => 'ads_management,pages_manage_posts,instagram_basic',
            'response_type' => 'code'
        ]);

        return 'https://www.facebook.com/v18.0/dialog/oauth?' . $params;
    }

    public function handleCallback(array $params): array
    {
        if (!isset($params['code'])) {
            throw new \Exception('Authorization code not provided');
        }

        $response = $this->makeRequest('get', 'https://graph.facebook.com/v18.0/oauth/access_token', [
            'query' => [
                'client_id' => config('services.facebook.client_id'),
                'client_secret' => config('services.facebook.client_secret'),
                'redirect_uri' => config('services.facebook.redirect_uri'),
                'code' => $params['code']
            ]
        ]);

        return [
            'access_token' => $response['access_token'],
            'token_type' => $response['token_type'] ?? 'bearer'
        ];
    }
}
