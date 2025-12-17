<?php

namespace App\Domains\ADStool\Services\ExternalApi;

use App\Domains\ADStool\DTOs\CreateADSCampaignDTO;
use App\Domains\ADStool\Exceptions\InstagramAdsApiException;
use App\Domains\ADStool\Mappers\InstagramAdsMapper;
use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

/**
 * Service especializado para campanhas do Instagram Ads
 *
 * Responsável por criar e gerenciar campanhas específicas do Instagram,
 * incluindo Stories, Reels, IGTV e Feed ads.
 */
class InstagramAdsCampaignService extends BaseExternalApiService
{
    protected ?array $credentials = null;
    protected ?string $adAccountId = null;
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
        return 'instagram_ads_campaign';
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
        $this->adAccountId = $credentials['ad_account_id'] ?? null;
        $this->instagramAccountId = $credentials['instagram_account_id'] ?? null;
    }

    /**
     * Verifica se o serviço pode se conectar à API
     */
    public function canConnect(): bool
    {
        if (!$this->accessToken || !$this->adAccountId) {
            return false;
        }

        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'connect');

            $response = $this->retryService->execute(function () {
                return $this->makeRequest('GET', "/{$this->adAccountId}", [
                    'access_token' => $this->accessToken,
                    'fields' => 'id,name,account_status'
                ]);
            });

            return isset($response['id']) && $response['account_status'] === 1;
        } catch (\Throwable $exception) {
            Log::error('Instagram Ads connection failed', [
                'error' => $exception->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Cria uma nova campanha no Instagram
     */
    public function createCampaign(CreateADSCampaignDTO $dto): array
    {
        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'create_campaign');

            $campaignData = InstagramAdsMapper::mapCampaignData($dto);

            $response = $this->retryService->execute(function () use ($campaignData) {
                return $this->makeRequest('POST', "/{$this->adAccountId}/campaigns", [
                    'access_token' => $this->accessToken,
                    'name' => $campaignData['name'],
                    'objective' => $campaignData['objective'],
                    'status' => $campaignData['status'],
                    'special_ad_categories' => $campaignData['special_ad_categories'] ?? []
                ]);
            });

            Log::info('Instagram campaign created successfully', [
                'campaign_id' => $response['id'] ?? null,
                'name' => $campaignData['name']
            ]);

            return [
                'success' => true,
                'campaign_id' => $response['id'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to create Instagram campaign', [
                'error' => $exception->getMessage(),
                'campaign_data' => $dto->toArray()
            ]);

            throw new InstagramAdsApiException(
                'Falha ao criar campanha no Instagram: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Cria um anúncio para o Feed do Instagram
     */
    public function createFeedAd(array $adData): array
    {
        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'create_ad');

            $response = $this->retryService->execute(function () use ($adData) {
                return $this->makeRequest('POST', "/{$this->adAccountId}/ads", [
                    'access_token' => $this->accessToken,
                    'name' => $adData['name'],
                    'adset_id' => $adData['adset_id'],
                    'creative' => [
                        'object_story_spec' => [
                            'page_id' => $adData['page_id'],
                            'instagram_actor_id' => $this->instagramAccountId,
                            'link_data' => [
                                'link' => $adData['link'] ?? null,
                                'message' => $adData['message'] ?? null,
                                'image_hash' => $adData['image_hash'] ?? null
                            ]
                        ]
                    ],
                    'status' => $adData['status'] ?? 'PAUSED'
                ]);
            });

            return [
                'success' => true,
                'ad_id' => $response['id'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to create Instagram feed ad', [
                'error' => $exception->getMessage(),
                'ad_data' => $adData
            ]);

            throw new InstagramAdsApiException(
                'Falha ao criar anúncio do Feed: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Cria um anúncio para Stories do Instagram
     */
    public function createStoriesAd(array $adData): array
    {
        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'create_ad');

            $response = $this->retryService->execute(function () use ($adData) {
                return $this->makeRequest('POST', "/{$this->adAccountId}/ads", [
                    'access_token' => $this->accessToken,
                    'name' => $adData['name'],
                    'adset_id' => $adData['adset_id'],
                    'creative' => [
                        'object_story_spec' => [
                            'page_id' => $adData['page_id'],
                            'instagram_actor_id' => $this->instagramAccountId,
                            'link_data' => [
                                'link' => $adData['link'] ?? null,
                                'message' => $adData['message'] ?? null,
                                'image_hash' => $adData['image_hash'] ?? null,
                                'call_to_action' => [
                                    'type' => $adData['cta_type'] ?? 'LEARN_MORE',
                                    'value' => [
                                        'link' => $adData['link'] ?? null
                                    ]
                                ]
                            ]
                        ]
                    ],
                    'status' => $adData['status'] ?? 'PAUSED'
                ]);
            });

            return [
                'success' => true,
                'ad_id' => $response['id'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to create Instagram stories ad', [
                'error' => $exception->getMessage(),
                'ad_data' => $adData
            ]);

            throw new InstagramAdsApiException(
                'Falha ao criar anúncio de Stories: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Cria um anúncio para Reels do Instagram
     */
    public function createReelsAd(array $adData): array
    {
        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'create_ad');

            $response = $this->retryService->execute(function () use ($adData) {
                return $this->makeRequest('POST', "/{$this->adAccountId}/ads", [
                    'access_token' => $this->accessToken,
                    'name' => $adData['name'],
                    'adset_id' => $adData['adset_id'],
                    'creative' => [
                        'object_story_spec' => [
                            'page_id' => $adData['page_id'],
                            'instagram_actor_id' => $this->instagramAccountId,
                            'video_data' => [
                                'video_id' => $adData['video_id'],
                                'image_url' => $adData['image_url'] ?? null,
                                'link_description' => $adData['link_description'] ?? null,
                                'call_to_action' => [
                                    'type' => $adData['cta_type'] ?? 'LEARN_MORE',
                                    'value' => [
                                        'link' => $adData['link'] ?? null
                                    ]
                                ]
                            ]
                        ]
                    ],
                    'status' => $adData['status'] ?? 'PAUSED'
                ]);
            });

            return [
                'success' => true,
                'ad_id' => $response['id'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to create Instagram reels ad', [
                'error' => $exception->getMessage(),
                'ad_data' => $adData
            ]);

            throw new InstagramAdsApiException(
                'Falha ao criar anúncio de Reels: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Cria um anúncio para IGTV do Instagram
     */
    public function createIGTVAd(array $adData): array
    {
        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'create_ad');

            $response = $this->retryService->execute(function () use ($adData) {
                return $this->makeRequest('POST', "/{$this->adAccountId}/ads", [
                    'access_token' => $this->accessToken,
                    'name' => $adData['name'],
                    'adset_id' => $adData['adset_id'],
                    'creative' => [
                        'object_story_spec' => [
                            'page_id' => $adData['page_id'],
                            'instagram_actor_id' => $this->instagramAccountId,
                            'video_data' => [
                                'video_id' => $adData['video_id'],
                                'image_url' => $adData['image_url'] ?? null,
                                'link_description' => $adData['link_description'] ?? null,
                                'call_to_action' => [
                                    'type' => $adData['cta_type'] ?? 'LEARN_MORE',
                                    'value' => [
                                        'link' => $adData['link'] ?? null
                                    ]
                                ]
                            ]
                        ]
                    ],
                    'status' => $adData['status'] ?? 'PAUSED'
                ]);
            });

            return [
                'success' => true,
                'ad_id' => $response['id'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to create Instagram IGTV ad', [
                'error' => $exception->getMessage(),
                'ad_data' => $adData
            ]);

            throw new InstagramAdsApiException(
                'Falha ao criar anúncio de IGTV: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Obtém insights de uma campanha
     */
    public function getCampaignInsights(string $campaignId, array $params = []): array
    {
        try {
            $this->rateLimiter->checkLimit('instagram_ads', 'get_insights');

            $defaultParams = [
                'access_token' => $this->accessToken,
                'fields' => 'impressions,clicks,spend,reach,frequency,cpm,cpp,ctr,cpc',
                'date_preset' => 'last_30d'
            ];

            $queryParams = array_merge($defaultParams, $params);

            $response = $this->retryService->execute(function () use ($campaignId, $queryParams) {
                return $this->makeRequest('GET', "/{$campaignId}/insights", $queryParams);
            });

            return [
                'success' => true,
                'insights' => $response['data'] ?? [],
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to get Instagram campaign insights', [
                'error' => $exception->getMessage(),
                'campaign_id' => $campaignId,
                'params' => $params
            ]);

            throw new InstagramAdsApiException(
                'Falha ao obter insights da campanha: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Obtém estatísticas de uso da API
     */
    public function getApiUsageStats(): array
    {
        try {
            $response = $this->makeRequest('GET', "/{$this->adAccountId}/insights", [
                'access_token' => $this->accessToken,
                'fields' => 'impressions,clicks,spend',
                'date_preset' => 'today'
            ]);

            return [
                'success' => true,
                'usage' => [
                    'impressions' => $response['data'][0]['impressions'] ?? 0,
                    'clicks' => $response['data'][0]['clicks'] ?? 0,
                    'spend' => $response['data'][0]['spend'] ?? 0
                ],
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to get Instagram API usage stats', [
                'error' => $exception->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $exception->getMessage()
            ];
        }
    }
}
