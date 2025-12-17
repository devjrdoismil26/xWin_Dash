<?php

namespace App\Domains\SocialBuffer\Services\ExternalApi;

use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

class TwitterTweetService extends BaseExternalApiService
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
     * Publica um tweet.
     */
    public function createTweet(string $text, array $options = []): array
    {
        try {
            $data = ['text' => $text];

            // Adicionar opções se fornecidas
            if (!empty($options['reply'])) {
                $data['reply'] = $options['reply'];
            }
            if (!empty($options['media'])) {
                $data['media'] = $options['media'];
            }
            if (!empty($options['poll'])) {
                $data['poll'] = $options['poll'];
            }

            $response = $this->makeProtectedHttpCall(
                'POST',
                '/tweets',
                $data,
                [],
                'create_tweet'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error creating tweet', [
                'error' => $e->getMessage(),
                'text_length' => strlen($text)
            ]);
            throw $e;
        }
    }

    /**
     * Obtém tweets do usuário autenticado.
     */
    public function getMyTweets(int $maxResults = 10, array $options = []): array
    {
        try {
            $me = $this->getMe();
            $userId = $me['data']['id'];

            $params = [
                'max_results' => $maxResults,
                'tweet.fields' => 'created_at,public_metrics,context_annotations,entities'
            ];

            // Adicionar opções se fornecidas
            if (!empty($options['start_time'])) {
                $params['start_time'] = $options['start_time'];
            }
            if (!empty($options['end_time'])) {
                $params['end_time'] = $options['end_time'];
            }
            if (!empty($options['since_id'])) {
                $params['since_id'] = $options['since_id'];
            }
            if (!empty($options['until_id'])) {
                $params['until_id'] = $options['until_id'];
            }

            $response = $this->makeProtectedHttpCall(
                'GET',
                "/users/{$userId}/tweets",
                $params,
                [],
                'get_my_tweets'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error getting my tweets', [
                'error' => $e->getMessage(),
                'max_results' => $maxResults
            ]);
            throw $e;
        }
    }

    /**
     * Obtém tweets de um usuário específico
     */
    public function getUserTweets(string $userId, int $maxResults = 10, array $options = []): array
    {
        try {
            $params = [
                'max_results' => $maxResults,
                'tweet.fields' => 'created_at,public_metrics,context_annotations,entities'
            ];

            // Adicionar opções se fornecidas
            if (!empty($options['start_time'])) {
                $params['start_time'] = $options['start_time'];
            }
            if (!empty($options['end_time'])) {
                $params['end_time'] = $options['end_time'];
            }
            if (!empty($options['since_id'])) {
                $params['since_id'] = $options['since_id'];
            }
            if (!empty($options['until_id'])) {
                $params['until_id'] = $options['until_id'];
            }

            $response = $this->makeProtectedHttpCall(
                'GET',
                "/users/{$userId}/tweets",
                $params,
                [],
                'get_user_tweets'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error getting user tweets', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
                'max_results' => $maxResults
            ]);
            throw $e;
        }
    }

    /**
     * Obtém timeline do usuário
     */
    public function getUserTimeline(string $userId, int $maxResults = 10, array $options = []): array
    {
        try {
            $params = [
                'max_results' => $maxResults,
                'tweet.fields' => 'created_at,public_metrics,context_annotations,entities'
            ];

            // Adicionar opções se fornecidas
            if (!empty($options['start_time'])) {
                $params['start_time'] = $options['start_time'];
            }
            if (!empty($options['end_time'])) {
                $params['end_time'] = $options['end_time'];
            }
            if (!empty($options['since_id'])) {
                $params['since_id'] = $options['since_id'];
            }
            if (!empty($options['until_id'])) {
                $params['until_id'] = $options['until_id'];
            }

            $response = $this->makeProtectedHttpCall(
                'GET',
                "/users/{$userId}/timelines/reverse_chronological",
                $params,
                [],
                'get_user_timeline'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error getting user timeline', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
                'max_results' => $maxResults
            ]);
            throw $e;
        }
    }

    /**
     * Obtém informações de um tweet específico
     */
    public function getTweet(string $tweetId): array
    {
        try {
            $response = $this->makeProtectedHttpCall(
                'GET',
                "/tweets/{$tweetId}",
                ['tweet.fields' => 'created_at,public_metrics,context_annotations,entities,author_id,conversation_id,referenced_tweets'],
                [],
                'get_tweet'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error getting tweet', [
                'error' => $e->getMessage(),
                'tweet_id' => $tweetId
            ]);
            throw $e;
        }
    }

    /**
     * Obtém métricas de um tweet
     */
    public function getTweetMetrics(string $tweetId): array
    {
        try {
            $response = $this->makeProtectedHttpCall(
                'GET',
                "/tweets/{$tweetId}",
                ['tweet.fields' => 'public_metrics'],
                [],
                'get_tweet_metrics'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error getting tweet metrics', [
                'error' => $e->getMessage(),
                'tweet_id' => $tweetId
            ]);
            throw $e;
        }
    }

    /**
     * Obtém informações do usuário autenticado.
     */
    protected function getMe(): array
    {
        $response = $this->makeProtectedHttpCall(
            'GET',
            '/users/me',
            [],
            [],
            'get_me'
        );

        return $this->processResponse($response);
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
