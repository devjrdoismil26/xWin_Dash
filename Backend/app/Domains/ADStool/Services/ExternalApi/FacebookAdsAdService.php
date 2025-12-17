<?php

namespace App\Domains\ADStool\Services\ExternalApi;

use App\Domains\ADStool\Exceptions\FacebookAdsApiException;
use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 Facebook Ads Ad Service
 *
 * Serviço especializado para operações de anúncios no Facebook Ads
 * Responsabilidade única: gerenciar anúncios
 */
class FacebookAdsAdService extends BaseExternalApiService
{
    protected ?array $credentials = null;
    protected ?string $adAccountId = null;
    protected ?string $accessToken = null;

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
        $this->accessToken = $credentials['access_token'] ?? null;
        $this->adAccountId = $credentials['ad_account_id'] ?? null;
    }

    /**
     * Cria um anúncio
     */
    public function createAd(array $adData): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}/ads";
        $adData['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $adData,
            [],
            'create_ad'
        );

        return $this->processResponse($response);
    }

    /**
     * Atualiza um anúncio
     */
    public function updateAd(string $adId, array $data): array
    {
        $endpoint = "/{$adId}";
        $data['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $data,
            [],
            'update_ad'
        );

        return $this->processResponse($response);
    }

    /**
     * Pausa um anúncio
     */
    public function pauseAd(string $adId): array
    {
        return $this->updateAd($adId, ['status' => 'PAUSED']);
    }

    /**
     * Ativa um anúncio
     */
    public function activateAd(string $adId): array
    {
        return $this->updateAd($adId, ['status' => 'ACTIVE']);
    }

    /**
     * Deleta um anúncio
     */
    public function deleteAd(string $adId): array
    {
        $endpoint = "/{$adId}";
        $params = ['access_token' => $this->accessToken];

        $response = $this->makeProtectedHttpCall(
            'DELETE',
            $endpoint,
            $params,
            [],
            'delete_ad'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém informações de um anúncio
     */
    public function getAd(string $adId, array $fields = []): array
    {
        $endpoint = "/{$adId}";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => implode(',', $fields ?: ['id', 'name', 'adset_id', 'status', 'created_time', 'updated_time'])
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_ad'
        );

        return $this->processResponse($response);
    }

    /**
     * Lista anúncios de um Ad Set
     */
    public function listAds(string $adSetId, array $filters = [], int $limit = 100): array
    {
        $endpoint = "/{$adSetId}/ads";
        $params = [
            'access_token' => $this->accessToken,
            'limit' => $limit,
            'fields' => 'id,name,adset_id,status,created_time,updated_time'
        ];

        // Adicionar filtros
        if (!empty($filters['status'])) {
            $params['effective_status'] = $filters['status'];
        }

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'list_ads'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém insights de um anúncio
     */
    public function getAdInsights(string $adId, array $params = []): array
    {
        $endpoint = "/{$adId}/insights";
        $defaultParams = [
            'access_token' => $this->accessToken,
            'fields' => 'impressions,clicks,spend,reach,frequency,cpm,cpc,ctr,cpp,cost_per_conversion,conversions,conversion_values',
            'date_preset' => 'last_30d'
        ];

        $params = array_merge($defaultParams, $params);

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_ad_insights'
        );

        return $this->processResponse($response);
    }

    /**
     * Faz upload de criativo
     */
    public function uploadCreative(string $filePath, string $type = 'image'): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}/adimages";
        $params = [
            'access_token' => $this->accessToken,
            'filename' => basename($filePath)
        ];

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $params,
            [],
            'upload_creative'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém criativos da conta
     */
    public function getCreatives(array $filters = [], int $limit = 100): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}/adimages";
        $params = [
            'access_token' => $this->accessToken,
            'limit' => $limit,
            'fields' => 'id,name,url,width,height,created_time'
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_creatives'
        );

        return $this->processResponse($response);
    }

    /**
     * Deleta um criativo
     */
    public function deleteCreative(string $creativeId): array
    {
        $endpoint = "/{$creativeId}";
        $params = ['access_token' => $this->accessToken];

        $response = $this->makeProtectedHttpCall(
            'DELETE',
            $endpoint,
            $params,
            [],
            'delete_creative'
        );

        return $this->processResponse($response);
    }

    // Implementação dos métodos abstratos

    public function getPlatformName(): string
    {
        return 'facebook';
    }

    public function getBaseUrl(): string
    {
        return 'https://graph.facebook.com/v18.0';
    }

    public function getDefaultHeaders(): array
    {
        return [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'User-Agent' => 'xWin-Dash-FacebookAds/1.0'
        ];
    }

    protected function getHealthCheckEndpoint(): string
    {
        return '/me';
    }

    /**
     * Sobrescreve o método para adicionar access_token automaticamente
     */
    protected function performHttpRequest(string $method, string $url, array $data, array $headers): array
    {
        // Adicionar access_token se não estiver presente
        if ($this->accessToken && !isset($data['access_token'])) {
            $data['access_token'] = $this->accessToken;
        }

        return parent::performHttpRequest($method, $url, $data, $headers);
    }
}
