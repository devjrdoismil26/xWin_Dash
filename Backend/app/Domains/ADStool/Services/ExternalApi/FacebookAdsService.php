<?php

namespace App\Domains\ADStool\Services\ExternalApi;

use App\Domains\ADStool\DTOs\CreateADSCampaignDTO;
use App\Domains\ADStool\Exceptions\FacebookAdsApiException;
use App\Domains\ADStool\Mappers\FacebookAdsMapper;
use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 Facebook Ads Service Completo
 *
 * Serviço principal para comunicação com a Facebook Ads API
 * Delega operações específicas para serviços especializados
 */
class FacebookAdsService extends BaseExternalApiService
{
    protected ?array $credentials = null;
    protected ?string $adAccountId = null;
    protected ?string $accessToken = null;

    private FacebookAdsCampaignService $campaignService;
    private FacebookAdsAdSetService $adSetService;
    private FacebookAdsAdService $adService;
    private FacebookAdsAudienceService $audienceService;
    private FacebookAdsAccountService $accountService;

    /**
     * @param array<string, mixed>|null $credentials As credenciais da API (token, etc.).
     */
    public function __construct(
        \App\Services\RateLimiterService $rateLimiter,
        \App\Services\CircuitBreakerService $circuitBreaker,
        \App\Services\RetryService $retryService,
        FacebookAdsCampaignService $campaignService,
        FacebookAdsAdSetService $adSetService,
        FacebookAdsAdService $adService,
        FacebookAdsAudienceService $audienceService,
        FacebookAdsAccountService $accountService,
        ?array $credentials = null
    ) {
        parent::__construct($rateLimiter, $circuitBreaker, $retryService);
        $this->campaignService = $campaignService;
        $this->adSetService = $adSetService;
        $this->adService = $adService;
        $this->audienceService = $audienceService;
        $this->accountService = $accountService;
        $this->setCredentials($credentials);
    }

    /**
     * Implementação dos métodos abstratos obrigatórios
     */
    public function getPlatformName(): string
    {
        return 'facebook_ads';
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
        return '/me?fields=id,name';
    }

    /**
     * Define as credenciais da API
     */
    public function setCredentials(?array $credentials): void
    {
        $this->credentials = $credentials;
        $this->accessToken = $credentials['access_token'] ?? null;
        $this->adAccountId = $credentials['ad_account_id'] ?? null;

        // Propagar credenciais para serviços especializados
        $this->campaignService->setCredentials($credentials);
        $this->adSetService->setCredentials($credentials);
        $this->adService->setCredentials($credentials);
        $this->audienceService->setCredentials($credentials);
        $this->accountService->setCredentials($credentials);
    }

    /**
     * Verifica se o serviço pode se conectar à API.
     */
    public function canConnect(): bool
    {
        return $this->campaignService->canConnect();
    }

    /**
     * Cria uma campanha no Facebook Ads.
     */
    public function createCampaign(CreateADSCampaignDTO $dto): array
    {
        return $this->campaignService->createCampaign($dto);
    }

    /**
     * Atualiza uma campanha existente
     */
    public function updateCampaign(string $campaignId, array $data): array
    {
        return $this->campaignService->updateCampaign($campaignId, $data);
    }

    /**
     * Pausa uma campanha
     */
    public function pauseCampaign(string $campaignId): array
    {
        return $this->campaignService->pauseCampaign($campaignId);
    }

    /**
     * Ativa uma campanha
     */
    public function activateCampaign(string $campaignId): array
    {
        return $this->campaignService->activateCampaign($campaignId);
    }

    /**
     * Deleta uma campanha
     */
    public function deleteCampaign(string $campaignId): array
    {
        return $this->campaignService->deleteCampaign($campaignId);
    }

    /**
     * Obtém informações de uma campanha
     */
    public function getCampaign(string $campaignId, array $fields = []): array
    {
        return $this->campaignService->getCampaign($campaignId, $fields);
    }

    /**
     * Lista campanhas da conta
     */
    public function listCampaigns(array $filters = [], int $limit = 100): array
    {
        return $this->campaignService->listCampaigns($filters, $limit);
    }

    /**
     * Cria um Ad Set
     */
    public function createAdSet(array $adSetData): array
    {
        return $this->adSetService->createAdSet($adSetData);
    }

    /**
     * Cria um anúncio
     */
    public function createAd(array $adData): array
    {
        return $this->adService->createAd($adData);
    }

    /**
     * Obtém insights de uma campanha
     */
    public function getCampaignInsights(string $campaignId, array $params = []): array
    {
        return $this->campaignService->getCampaignInsights($campaignId, $params);
    }

    /**
     * Faz upload de criativo
     */
    public function uploadCreative(string $filePath, string $type = 'image'): array
    {
        return $this->adService->uploadCreative($filePath, $type);
    }

    /**
     * Obtém audiences personalizadas
     */
    public function getCustomAudiences(): array
    {
        return $this->audienceService->getCustomAudiences();
    }

    /**
     * Cria audience personalizada
     */
    public function createCustomAudience(array $audienceData): array
    {
        return $this->audienceService->createCustomAudience($audienceData);
    }

    /**
     * Obtém informações da conta de anúncios
     */
    public function getAdAccountInfo(): array
    {
        return $this->accountService->getAdAccountInfo();
    }

    /**
     * Obtém estatísticas de uso da API
     */
    public function getApiUsageStats(): array
    {
        return $this->accountService->getApiUsageStats();
    }
}
