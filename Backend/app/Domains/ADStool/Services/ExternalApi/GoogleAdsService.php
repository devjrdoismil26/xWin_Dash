<?php

namespace App\Domains\ADStool\Services\ExternalApi;

use App\Domains\ADStool\DTOs\CreateADSCampaignDTO;
use App\Domains\ADStool\Exceptions\GoogleAdsApiException;
use App\Domains\ADStool\Mappers\GoogleAdsMapper;
use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 Google Ads Service (Refatorado)
 *
 * Orquestra serviços especializados para Google Ads
 * Inclui Search, Display, Shopping e YouTube ads
 *
 * Refatorado para reduzir complexidade e melhorar manutenibilidade.
 */
class GoogleAdsService extends BaseExternalApiService
{
    private GoogleAdsCampaignService $campaignService;

    protected ?array $credentials = null;
    protected ?string $customerId = null;
    protected ?string $developerToken = null;
    protected ?string $clientId = null;
    protected ?string $clientSecret = null;
    protected ?string $refreshToken = null;

    public function __construct(
        \App\Services\RateLimiterService $rateLimiter,
        \App\Services\CircuitBreakerService $circuitBreaker,
        \App\Services\RetryService $retryService,
        GoogleAdsCampaignService $campaignService,
        ?array $credentials = null
    ) {
        parent::__construct($rateLimiter, $circuitBreaker, $retryService);
        $this->campaignService = $campaignService;
        $this->setCredentials($credentials);
    }

    /**
     * Implementação dos métodos abstratos obrigatórios
     */
    public function getPlatformName(): string
    {
        return 'google_ads';
    }

    public function getBaseUrl(): string
    {
        return 'https://googleads.googleapis.com/v14';
    }

    public function getDefaultHeaders(): array
    {
        $headers = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ];

        if ($this->developerToken) {
            $headers['developer-token'] = $this->developerToken;
        }

        return $headers;
    }

    protected function getHealthCheckEndpoint(): string
    {
        return '/customers:listAccessibleCustomers';
    }

    /**
     * Define as credenciais da API
     */
    public function setCredentials(?array $credentials): void
    {
        $this->credentials = $credentials;
        $this->customerId = $credentials['customer_id'] ?? null;
        $this->developerToken = $credentials['developer_token'] ?? null;
        $this->clientId = $credentials['client_id'] ?? null;
        $this->clientSecret = $credentials['client_secret'] ?? null;
        $this->refreshToken = $credentials['refresh_token'] ?? null;

        // Propagar credenciais para o serviço especializado
        $this->campaignService->setCredentials($credentials);
    }

    /**
     * Verifica se o serviço pode se conectar à API
     */
    public function canConnect(): bool
    {
        return $this->campaignService->canConnect();
    }

    // ===== CAMPANHAS =====

    /**
     * Cria uma nova campanha no Google Ads
     */
    public function createCampaign(CreateADSCampaignDTO $dto): array
    {
        return $this->campaignService->createCampaign($dto);
    }

    /**
     * Cria um anúncio de texto para Search
     */
    public function createSearchAd(array $adData): array
    {
        return $this->campaignService->createSearchAd($adData);
    }

    /**
     * Cria um anúncio de Display
     */
    public function createDisplayAd(array $adData): array
    {
        return $this->campaignService->createDisplayAd($adData);
    }

    /**
     * Cria um anúncio de Shopping
     */
    public function createShoppingAd(array $adData): array
    {
        return $this->campaignService->createShoppingAd($adData);
    }

    /**
     * Cria um anúncio de YouTube
     */
    public function createYouTubeAd(array $adData): array
    {
        return $this->campaignService->createYouTubeAd($adData);
    }

    /**
     * Obtém insights de uma campanha
     */
    public function getCampaignInsights(string $campaignId, array $params = []): array
    {
        return $this->campaignService->getCampaignInsights($campaignId, $params);
    }

    // ===== ESTATÍSTICAS =====

    /**
     * Obtém estatísticas de uso da API
     */
    public function getApiUsageStats(): array
    {
        return $this->campaignService->getApiUsageStats();
    }
}
