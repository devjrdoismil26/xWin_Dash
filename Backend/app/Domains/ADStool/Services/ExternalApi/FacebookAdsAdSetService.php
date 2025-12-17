<?php

namespace App\Domains\ADStool\Services\ExternalApi;

use App\Domains\ADStool\Exceptions\FacebookAdsApiException;
use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 Facebook Ads AdSet Service
 *
 * Serviço especializado para operações de AdSets no Facebook Ads
 * Responsabilidade única: gerenciar AdSets
 */
class FacebookAdsAdSetService extends BaseExternalApiService
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
     * Cria um Ad Set
     */
    public function createAdSet(array $adSetData): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}/adsets";
        $adSetData['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $adSetData,
            [],
            'create_adset'
        );

        return $this->processResponse($response);
    }

    /**
     * Atualiza um Ad Set
     */
    public function updateAdSet(string $adSetId, array $data): array
    {
        $endpoint = "/{$adSetId}";
        $data['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $data,
            [],
            'update_adset'
        );

        return $this->processResponse($response);
    }

    /**
     * Pausa um Ad Set
     */
    public function pauseAdSet(string $adSetId): array
    {
        return $this->updateAdSet($adSetId, ['status' => 'PAUSED']);
    }

    /**
     * Ativa um Ad Set
     */
    public function activateAdSet(string $adSetId): array
    {
        return $this->updateAdSet($adSetId, ['status' => 'ACTIVE']);
    }

    /**
     * Deleta um Ad Set
     */
    public function deleteAdSet(string $adSetId): array
    {
        $endpoint = "/{$adSetId}";
        $params = ['access_token' => $this->accessToken];

        $response = $this->makeProtectedHttpCall(
            'DELETE',
            $endpoint,
            $params,
            [],
            'delete_adset'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém informações de um Ad Set
     */
    public function getAdSet(string $adSetId, array $fields = []): array
    {
        $endpoint = "/{$adSetId}";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => implode(',', $fields ?: ['id', 'name', 'campaign_id', 'status', 'daily_budget', 'billing_event', 'optimization_goal', 'created_time', 'updated_time'])
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_adset'
        );

        return $this->processResponse($response);
    }

    /**
     * Lista Ad Sets de uma campanha
     */
    public function listAdSets(string $campaignId, array $filters = [], int $limit = 100): array
    {
        $endpoint = "/{$campaignId}/adsets";
        $params = [
            'access_token' => $this->accessToken,
            'limit' => $limit,
            'fields' => 'id,name,campaign_id,status,daily_budget,billing_event,optimization_goal,created_time,updated_time'
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
            'list_adsets'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém insights de um Ad Set
     */
    public function getAdSetInsights(string $adSetId, array $params = []): array
    {
        $endpoint = "/{$adSetId}/insights";
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
            'get_adset_insights'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém estatísticas de uso da API
     */
    public function getApiUsageStats(): array
    {
        try {
            $response = $this->makeProtectedHttpCall(
                'GET',
                "/act_{$this->adAccountId}/insights",
                [
                    'access_token' => $this->accessToken,
                    'fields' => 'impressions,clicks,spend',
                    'date_preset' => 'today',
                    'level' => 'account'
                ],
                [],
                'get_usage_stats'
            );

            return $this->processResponse($response);
        } catch (\Exception $e) {
            Log::error('Error getting Facebook Ads API usage stats', [
                'error' => $e->getMessage()
            ]);
            return [];
        }
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
