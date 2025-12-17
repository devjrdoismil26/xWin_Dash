<?php

namespace App\Domains\ADStool\Services\ExternalApi;

use App\Domains\ADStool\DTOs\CreateADSCampaignDTO;
use App\Domains\ADStool\Exceptions\InstagramAdsApiException;
use App\Domains\ADStool\Mappers\InstagramAdsMapper;
use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 Instagram Ads Service (Refatorado)
 *
 * Orquestra serviços especializados para Instagram Ads via Facebook Business SDK
 * Inclui Stories, Reels, IGTV e funcionalidades específicas do Instagram
 *
 * Refatorado para reduzir complexidade e melhorar manutenibilidade.
 */
class InstagramAdsService extends BaseExternalApiService
{
    private InstagramAdsCampaignService $campaignService;
    private InstagramAdsMediaService $mediaService;

    protected ?array $credentials = null;
    protected ?string $adAccountId = null;
    protected ?string $accessToken = null;
    protected ?string $instagramAccountId = null;

    public function __construct(
        \App\Services\RateLimiterService $rateLimiter,
        \App\Services\CircuitBreakerService $circuitBreaker,
        \App\Services\RetryService $retryService,
        InstagramAdsCampaignService $campaignService,
        InstagramAdsMediaService $mediaService,
        ?array $credentials = null
    ) {
        parent::__construct($rateLimiter, $circuitBreaker, $retryService);
        $this->campaignService = $campaignService;
        $this->mediaService = $mediaService;
        $this->setCredentials($credentials);
    }

    /**
     * Implementação dos métodos abstratos obrigatórios
     */
    public function getPlatformName(): string
    {
        return 'instagram_ads';
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
        return '/me?fields=id,username';
    }

    /**
     * Define as credenciais da API
     */
    public function setCredentials(?array $credentials): void
    {
        $this->credentials = $credentials;
        $this->accessToken = $credentials['access_token'] ?? null;
        $this->adAccountId = $credentials['ad_account_id'] ?? null;
        $this->instagramAccountId = $credentials['instagram_account_id'] ?? null;

        // Propagar credenciais para os serviços especializados
        $this->campaignService->setCredentials($credentials);
        $this->mediaService->setCredentials($credentials);
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
     * Cria uma nova campanha no Instagram
     */
    public function createCampaign(CreateADSCampaignDTO $dto): array
    {
        return $this->campaignService->createCampaign($dto);
    }

    /**
     * Cria um anúncio para o Feed do Instagram
     */
    public function createFeedAd(array $adData): array
    {
        return $this->campaignService->createFeedAd($adData);
    }

    /**
     * Cria um anúncio para Stories do Instagram
     */
    public function createStoriesAd(array $adData): array
    {
        return $this->campaignService->createStoriesAd($adData);
    }

    /**
     * Cria um anúncio para Reels do Instagram
     */
    public function createReelsAd(array $adData): array
    {
        return $this->campaignService->createReelsAd($adData);
    }

    /**
     * Cria um anúncio para IGTV do Instagram
     */
    public function createIGTVAd(array $adData): array
    {
        return $this->campaignService->createIGTVAd($adData);
    }

    /**
     * Obtém insights de uma campanha
     */
    public function getCampaignInsights(string $campaignId, array $params = []): array
    {
        return $this->campaignService->getCampaignInsights($campaignId, $params);
    }

    // ===== MÍDIA =====

    /**
     * Faz upload de mídia para o Instagram
     */
    public function uploadMedia(string $filePath, string $type = 'image'): array
    {
        return $this->mediaService->uploadMedia($filePath, $type);
    }

    /**
     * Obtém informações da conta do Instagram
     */
    public function getInstagramAccountInfo(): array
    {
        return $this->mediaService->getInstagramAccountInfo();
    }

    /**
     * Obtém mídia da conta do Instagram
     */
    public function getInstagramMedia(array $params = []): array
    {
        return $this->mediaService->getInstagramMedia($params);
    }

    /**
     * Obtém hashtags sugeridas baseadas em uma palavra-chave
     */
    public function getSuggestedHashtags(string $keyword): array
    {
        return $this->mediaService->getSuggestedHashtags($keyword);
    }

    /**
     * Obtém informações de uma hashtag específica
     */
    public function getHashtagInfo(string $hashtagId): array
    {
        return $this->mediaService->getHashtagInfo($hashtagId);
    }

    /**
     * Obtém mídia de uma hashtag específica
     */
    public function getHashtagMedia(string $hashtagId, array $params = []): array
    {
        return $this->mediaService->getHashtagMedia($hashtagId, $params);
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
