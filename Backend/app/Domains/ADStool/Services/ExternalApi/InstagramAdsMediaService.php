<?php

namespace App\Domains\ADStool\Services\ExternalApi;

use App\Domains\ADStool\Exceptions\InstagramAdsApiException;
use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

/**
 * Service especializado para mídia do Instagram Ads
 *
 * Responsável por gerenciar mídia do Instagram,
 * incluindo upload, hashtags e informações da conta.
 */
class InstagramAdsMediaService extends BaseExternalApiService
{
    protected ?array $credentials = null;
    protected ?string $accessToken = null;
    protected ?string $instagramAccountId = null;

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
     * Implementação dos métodos abstratos obrigatórios
     */
    public function getPlatformName(): string
    {
        return 'instagram_ads_media';
    }

    public function getBaseUrl(): string
    {
        return 'https://graph.facebook.com/v18.0';
    }

    public function getDefaultHeaders(): array
    {
        $headers = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ];

        return $headers;
    }

    protected function getHealthCheckEndpoint(): string
    {
        return '/me/accounts';
    }    /**
     * Define as credenciais da API
     */
    public function setCredentials(?array $credentials): void
    {
        $this->credentials = $credentials;
        $this->accessToken = $credentials['access_token'] ?? null;
        $this->instagramAccountId = $credentials['instagram_account_id'] ?? null;
    }

    /**
     * Faz upload de mídia para o Instagram
     */
    public function uploadMedia(string $filePath, string $type = 'image'): array
    {
        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'upload_media');

            if (!file_exists($filePath)) {
                throw new InstagramAdsApiException('Arquivo não encontrado: ' . $filePath);
            }

            $response = $this->retryService->execute(function () use ($filePath, $type) {
                return $this->makeRequest('POST', "/{$this->instagramAccountId}/media", [
                    'access_token' => $this->accessToken,
                    'image_url' => $filePath,
                    'media_type' => $type
                ]);
            });

            Log::info('Instagram media uploaded successfully', [
                'media_id' => $response['id'] ?? null,
                'type' => $type
            ]);

            return [
                'success' => true,
                'media_id' => $response['id'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to upload Instagram media', [
                'error' => $exception->getMessage(),
                'file_path' => $filePath,
                'type' => $type
            ]);

            throw new InstagramAdsApiException(
                'Falha ao fazer upload da mídia: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Obtém informações da conta do Instagram
     */
    public function getInstagramAccountInfo(): array
    {
        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'get_account_info');

            $response = $this->retryService->execute(function () {
                return $this->makeRequest('GET', "/{$this->instagramAccountId}", [
                    'access_token' => $this->accessToken,
                    'fields' => 'id,username,account_type,media_count,followers_count,follows_count'
                ]);
            });

            return [
                'success' => true,
                'account_info' => [
                    'id' => $response['id'] ?? null,
                    'username' => $response['username'] ?? null,
                    'account_type' => $response['account_type'] ?? null,
                    'media_count' => $response['media_count'] ?? 0,
                    'followers_count' => $response['followers_count'] ?? 0,
                    'follows_count' => $response['follows_count'] ?? 0
                ],
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to get Instagram account info', [
                'error' => $exception->getMessage()
            ]);

            throw new InstagramAdsApiException(
                'Falha ao obter informações da conta: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Obtém mídia da conta do Instagram
     */
    public function getInstagramMedia(array $params = []): array
    {
        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'get_media');

            $defaultParams = [
                'access_token' => $this->accessToken,
                'fields' => 'id,media_type,media_url,thumbnail_url,caption,timestamp,like_count,comments_count'
            ];

            $queryParams = array_merge($defaultParams, $params);

            $response = $this->retryService->execute(function () use ($queryParams) {
                return $this->makeRequest('GET', "/{$this->instagramAccountId}/media", $queryParams);
            });

            return [
                'success' => true,
                'media' => $response['data'] ?? [],
                'paging' => $response['paging'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to get Instagram media', [
                'error' => $exception->getMessage(),
                'params' => $params
            ]);

            throw new InstagramAdsApiException(
                'Falha ao obter mídia do Instagram: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Obtém hashtags sugeridas baseadas em uma palavra-chave
     */
    public function getSuggestedHashtags(string $keyword): array
    {
        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'get_hashtags');

            $response = $this->retryService->execute(function () use ($keyword) {
                return $this->makeRequest('GET', "/ig_hashtag_search", [
                    'access_token' => $this->accessToken,
                    'user_id' => $this->instagramAccountId,
                    'q' => $keyword
                ]);
            });

            return [
                'success' => true,
                'hashtags' => $response['data'] ?? [],
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to get suggested hashtags', [
                'error' => $exception->getMessage(),
                'keyword' => $keyword
            ]);

            throw new InstagramAdsApiException(
                'Falha ao obter hashtags sugeridas: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Obtém informações de uma hashtag específica
     */
    public function getHashtagInfo(string $hashtagId): array
    {
        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'get_hashtag_info');

            $response = $this->retryService->execute(function () use ($hashtagId) {
                return $this->makeRequest('GET', "/{$hashtagId}", [
                    'access_token' => $this->accessToken,
                    'fields' => 'id,name,media_count'
                ]);
            });

            return [
                'success' => true,
                'hashtag_info' => [
                    'id' => $response['id'] ?? null,
                    'name' => $response['name'] ?? null,
                    'media_count' => $response['media_count'] ?? 0
                ],
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to get hashtag info', [
                'error' => $exception->getMessage(),
                'hashtag_id' => $hashtagId
            ]);

            throw new InstagramAdsApiException(
                'Falha ao obter informações da hashtag: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Obtém mídia de uma hashtag específica
     */
    public function getHashtagMedia(string $hashtagId, array $params = []): array
    {
        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'get_hashtag_media');

            $defaultParams = [
                'access_token' => $this->accessToken,
                'fields' => 'id,media_type,media_url,thumbnail_url,caption,timestamp,like_count,comments_count'
            ];

            $queryParams = array_merge($defaultParams, $params);

            $response = $this->retryService->execute(function () use ($hashtagId, $queryParams) {
                return $this->makeRequest('GET', "/{$hashtagId}/recent_media", $queryParams);
            });

            return [
                'success' => true,
                'media' => $response['data'] ?? [],
                'paging' => $response['paging'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to get hashtag media', [
                'error' => $exception->getMessage(),
                'hashtag_id' => $hashtagId,
                'params' => $params
            ]);

            throw new InstagramAdsApiException(
                'Falha ao obter mídia da hashtag: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }
}
