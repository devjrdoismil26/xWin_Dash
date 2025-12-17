<?php

namespace App\Domains\SocialBuffer\Services\ExternalApi;

use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

class TwitterUserService extends BaseExternalApiService
{
    protected ?array $credentials = null;
    protected ?string $bearerToken = null;
    protected ?string $consumerKey = null;
    protected ?string $consumerSecret = null;
    protected ?string $accessToken = null;
    protected ?string $accessTokenSecret = null;

    public function __construct(
        \App\Services\RateLimiterService $rateLimiter,
        \App\Services\CircuitBreakerService $circuitBreaker,
        \App\Services\RetryService $retryService,
        ?array $credentials = null
    ) {
        parent::__construct($rateLimiter, $circuitBreaker, $retryService);
        $this->setCredentials($credentials);
    }

    /**
     * Define as credenciais da API
     */
    public function setCredentials(?array $credentials): void
    {
        $this->credentials = $credentials;
        $this->bearerToken = $credentials['bearer_token'] ?? config('services.twitter.bearer_token');
        $this->consumerKey = $credentials['consumer_key'] ?? config('services.twitter.consumer_key');
        $this->consumerSecret = $credentials['consumer_secret'] ?? config('services.twitter.consumer_secret');
        $this->accessToken = $credentials['access_token'] ?? null;
        $this->accessTokenSecret = $credentials['access_token_secret'] ?? null;
    }

    /**
     * Obtém informações do usuário autenticado.
     */
    public function getMe(): array
    {
        try {
            $response = $this->makeProtectedHttpCall(
                'GET',
                '/users/me',
                [],
                [],
                'get_me'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error getting authenticated user info', [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Obtém informações de um usuário por username
     */
    public function getUserByUsername(string $username): array
    {
        try {
            $response = $this->makeProtectedHttpCall(
                'GET',
                "/users/by/username/{$username}",
                ['user.fields' => 'created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld'],
                [],
                'get_user_by_username'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error getting user by username', [
                'error' => $e->getMessage(),
                'username' => $username
            ]);
            throw $e;
        }
    }

    /**
     * Obtém informações de um usuário por ID
     */
    public function getUserById(string $userId): array
    {
        try {
            $response = $this->makeProtectedHttpCall(
                'GET',
                "/users/{$userId}",
                ['user.fields' => 'created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld'],
                [],
                'get_user_by_id'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error getting user by ID', [
                'error' => $e->getMessage(),
                'user_id' => $userId
            ]);
            throw $e;
        }
    }

    /**
     * Obtém seguidores de um usuário
     */
    public function getUserFollowers(string $userId, int $maxResults = 100, ?string $paginationToken = null): array
    {
        try {
            $params = [
                'max_results' => $maxResults,
                'user.fields' => 'created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld'
            ];

            if ($paginationToken) {
                $params['pagination_token'] = $paginationToken;
            }

            $response = $this->makeProtectedHttpCall(
                'GET',
                "/users/{$userId}/followers",
                $params,
                [],
                'get_user_followers'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error getting user followers', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
                'max_results' => $maxResults
            ]);
            throw $e;
        }
    }

    /**
     * Obtém usuários seguidos por um usuário
     */
    public function getUserFollowing(string $userId, int $maxResults = 100, ?string $paginationToken = null): array
    {
        try {
            $params = [
                'max_results' => $maxResults,
                'user.fields' => 'created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld'
            ];

            if ($paginationToken) {
                $params['pagination_token'] = $paginationToken;
            }

            $response = $this->makeProtectedHttpCall(
                'GET',
                "/users/{$userId}/following",
                $params,
                [],
                'get_user_following'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error getting user following', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
                'max_results' => $maxResults
            ]);
            throw $e;
        }
    }

    /**
     * Busca usuários por query
     */
    public function searchUsers(string $query, int $maxResults = 10, array $options = []): array
    {
        try {
            $params = [
                'query' => $query,
                'max_results' => $maxResults,
                'user.fields' => 'created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld'
            ];

            // Adicionar opções se fornecidas
            if (!empty($options['expansions'])) {
                $params['expansions'] = $options['expansions'];
            }

            $response = $this->makeProtectedHttpCall(
                'GET',
                '/users/search',
                $params,
                [],
                'search_users'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error searching users', [
                'error' => $e->getMessage(),
                'query' => $query,
                'max_results' => $maxResults
            ]);
            throw $e;
        }
    }

    /**
     * Obtém estatísticas de uso da API
     */
    public function getApiUsageStats(): array
    {
        try {
            $response = $this->makeProtectedHttpCall(
                'GET',
                '/users/me',
                [],
                [],
                'get_usage_stats'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error getting API usage stats', [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Verifica se o serviço pode se conectar à API.
     */
    public function canConnect(): bool
    {
        if (!$this->bearerToken) {
            return false;
        }

        try {
            $response = $this->makeProtectedHttpCall(
                'GET',
                '/users/me',
                [],
                [],
                'connection_test'
            );

            return $response['status'] === 200;
        } catch (\Exception $e) {
            Log::error('Twitter connection test failed', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    // Implementação dos métodos abstratos

    public function getPlatformName(): string
    {
        return 'twitter';
    }

    public function getBaseUrl(): string
    {
        return 'https://api.twitter.com/2';
    }

    public function getDefaultHeaders(): array
    {
        $headers = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'User-Agent' => 'xWin-Dash-Twitter/1.0'
        ];

        // Adicionar Bearer Token se disponível
        if ($this->bearerToken) {
            $headers['Authorization'] = 'Bearer ' . $this->bearerToken;
        }

        return $headers;
    }

    protected function getHealthCheckEndpoint(): string
    {
        return '/users/me';
    }
}
