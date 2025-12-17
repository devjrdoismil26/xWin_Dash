<?php

namespace App\Domains\SocialBuffer\Services\ExternalApi;

use App\Services\BaseExternalApiService;
use App\Services\OAuth1Service;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 Twitter Service Completo
 *
 * Serviço completo para comunicação com a Twitter API v2
 * Inclui OAuth 1.0a, rate limiting, circuit breaker e retry automático
 */
class TwitterService extends BaseExternalApiService
{
    protected TwitterTweetService $tweetService;
    protected TwitterUserService $userService;
    protected ?array $credentials = null;
    protected ?string $bearerToken = null;
    protected ?string $consumerKey = null;
    protected ?string $consumerSecret = null;
    protected ?string $accessToken = null;
    protected ?string $accessTokenSecret = null;
    protected ?OAuth1Service $oauthService = null;

    public function __construct(
        \App\Services\RateLimiterService $rateLimiter,
        \App\Services\CircuitBreakerService $circuitBreaker,
        \App\Services\RetryService $retryService,
        TwitterTweetService $tweetService,
        TwitterUserService $userService,
        ?array $credentials = null
    ) {
        parent::__construct($rateLimiter, $circuitBreaker, $retryService);
        $this->tweetService = $tweetService;
        $this->userService = $userService;
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

        // Propagate credentials to specialized services
        $this->tweetService->setCredentials($credentials);
        $this->userService->setCredentials($credentials);

        // Inicializar OAuth 1.0a se tiver credenciais
        if ($this->consumerKey && $this->consumerSecret) {
            $this->oauthService = new OAuth1Service($this->consumerKey, $this->consumerSecret);
            if ($this->accessToken && $this->accessTokenSecret) {
                $this->oauthService->setAccessCredentials($this->accessToken, $this->accessTokenSecret);
            }
        }
    }

    /**
     * Verifica se o serviço pode se conectar à API.
     */
    public function canConnect(): bool
    {
        return $this->userService->canConnect();
    }

    /**
     * Obtém informações do usuário autenticado.
     */
    public function getMe(): array
    {
        return $this->userService->getMe();
    }

    /**
     * Publica um tweet.
     */
    public function createTweet(string $text, array $options = []): array
    {
        return $this->tweetService->createTweet($text, $options);
    }

    /**
     * Obtém tweets do usuário autenticado.
     */
    public function getMyTweets(int $maxResults = 10, array $options = []): array
    {
        return $this->tweetService->getMyTweets($maxResults, $options);
    }

    /**
     * Obtém tweets de um usuário específico
     */
    public function getUserTweets(string $userId, int $maxResults = 10, array $options = []): array
    {
        return $this->tweetService->getUserTweets($userId, $maxResults, $options);
    }

    /**
     * Obtém informações de um usuário por username
     */
    public function getUserByUsername(string $username): array
    {
        return $this->userService->getUserByUsername($username);
    }

    /**
     * Obtém informações de um usuário por ID
     */
    public function getUserById(string $userId): array
    {
        return $this->userService->getUserById($userId);
    }

    /**
     * Obtém seguidores de um usuário
     */
    public function getUserFollowers(string $userId, int $maxResults = 100, ?string $paginationToken = null): array
    {
        return $this->userService->getUserFollowers($userId, $maxResults, $paginationToken);
    }

    /**
     * Obtém usuários seguidos por um usuário
     */
    public function getUserFollowing(string $userId, int $maxResults = 100, ?string $paginationToken = null): array
    {
        return $this->userService->getUserFollowing($userId, $maxResults, $paginationToken);
    }

    /**
     * Obtém timeline do usuário
     */
    public function getUserTimeline(string $userId, int $maxResults = 10, array $options = []): array
    {
        return $this->tweetService->getUserTimeline($userId, $maxResults, $options);
    }

    /**
     * Obtém informações de um tweet específico
     */
    public function getTweet(string $tweetId): array
    {
        return $this->tweetService->getTweet($tweetId);
    }

    /**
     * Obtém métricas de um tweet
     */
    public function getTweetMetrics(string $tweetId): array
    {
        return $this->tweetService->getTweetMetrics($tweetId);
    }

    /**
     * Obtém estatísticas de uso da API
     */
    public function getApiUsageStats(): array
    {
        return $this->userService->getApiUsageStats();
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

    /**
     * Sobrescreve o método para usar OAuth 1.0a quando necessário
     */
    protected function performHttpRequest(string $method, string $url, array $data, array $headers): array
    {
        // Se temos OAuth 1.0a configurado e não temos Bearer Token, usar OAuth
        if ($this->oauthService && !$this->bearerToken) {
            return $this->oauthService->makeRequest($method, $url, $data, $headers);
        }

        // Caso contrário, usar método padrão
        return parent::performHttpRequest($method, $url, $data, $headers);
    }
}
