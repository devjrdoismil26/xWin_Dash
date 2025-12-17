<?php

namespace App\Domains\ADStool\Services\ExternalApi;

use App\Domains\ADStool\DTOs\CreateADSCampaignDTO;
use App\Domains\ADStool\Exceptions\FacebookAdsApiException;
use App\Domains\ADStool\Mappers\FacebookAdsMapper;
use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 Facebook Ads Campaign Service
 *
 * Serviço especializado para operações de campanhas no Facebook Ads
 * Responsabilidade única: gerenciar campanhas
 */
class FacebookAdsCampaignService extends BaseExternalApiService
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
     * Cria uma campanha no Facebook Ads.
     */
    public function createCampaign(CreateADSCampaignDTO $dto): array
    {
        if (!$this->adAccountId) {
            throw new FacebookAdsApiException('ID da conta de anúncios não configurado.');
        }

        $endpoint = "/act_{$this->adAccountId}/campaigns";
        $params = FacebookAdsMapper::toPlatformCreationData($dto);
        $params['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $params,
            [],
            'create_campaign'
        );

        return $this->processResponse($response);
    }

    /**
     * Atualiza uma campanha existente
     */
    public function updateCampaign(string $campaignId, array $data): array
    {
        $endpoint = "/{$campaignId}";
        $data['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $data,
            [],
            'update_campaign'
        );

        return $this->processResponse($response);
    }

    /**
     * Pausa uma campanha
     */
    public function pauseCampaign(string $campaignId): array
    {
        return $this->updateCampaign($campaignId, ['status' => 'PAUSED']);
    }

    /**
     * Ativa uma campanha
     */
    public function activateCampaign(string $campaignId): array
    {
        return $this->updateCampaign($campaignId, ['status' => 'ACTIVE']);
    }

    /**
     * Deleta uma campanha
     */
    public function deleteCampaign(string $campaignId): array
    {
        $endpoint = "/{$campaignId}";
        $params = ['access_token' => $this->accessToken];

        $response = $this->makeProtectedHttpCall(
            'DELETE',
            $endpoint,
            $params,
            [],
            'delete_campaign'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém informações de uma campanha
     */
    public function getCampaign(string $campaignId, array $fields = []): array
    {
        $endpoint = "/{$campaignId}";
        $params = [
            'access_token' => $this->accessToken,
            'fields' => implode(',', $fields ?: ['id', 'name', 'objective', 'status', 'daily_budget', 'created_time', 'updated_time'])
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_campaign'
        );

        return $this->processResponse($response);
    }

    /**
     * Lista campanhas da conta
     */
    public function listCampaigns(array $filters = [], int $limit = 100): array
    {
        $endpoint = "/act_{$this->adAccountId}/campaigns";
        $params = [
            'access_token' => $this->accessToken,
            'limit' => $limit,
            'fields' => 'id,name,objective,status,daily_budget,created_time,updated_time'
        ];

        // Adicionar filtros
        if (!empty($filters['status'])) {
            $params['effective_status'] = $filters['status'];
        }
        if (!empty($filters['objective'])) {
            $params['objective'] = $filters['objective'];
        }

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'list_campaigns'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém insights de uma campanha
     */
    public function getCampaignInsights(string $campaignId, array $params = []): array
    {
        $endpoint = "/{$campaignId}/insights";
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
            'get_insights'
        );

        return $this->processResponse($response);
    }

    /**
     * Verifica se o serviço pode se conectar à API.
     */
    public function canConnect(): bool
    {
        if (!$this->accessToken) {
            return false;
        }

        try {
            $response = $this->makeProtectedHttpCall(
                'GET',
                '/me',
                ['access_token' => $this->accessToken],
                [],
                'connection_test'
            );

            return $response['status'] === 200;
        } catch (\Exception $e) {
            Log::error('Facebook Ads connection test failed', [
                'error' => $e->getMessage()
            ]);
            return false;
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
