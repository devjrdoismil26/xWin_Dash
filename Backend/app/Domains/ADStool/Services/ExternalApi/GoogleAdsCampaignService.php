<?php

namespace App\Domains\ADStool\Services\ExternalApi;

use App\Domains\ADStool\DTOs\CreateADSCampaignDTO;
use App\Domains\ADStool\Exceptions\GoogleAdsApiException;
use App\Domains\ADStool\Mappers\GoogleAdsMapper;
use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

/**
 * Service especializado para campanhas do Google Ads
 *
 * Responsável por criar e gerenciar campanhas do Google Ads,
 * incluindo Search, Display, Shopping e YouTube ads.
 */
class GoogleAdsCampaignService extends BaseExternalApiService
{
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
        return 'google_ads_campaign';
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

        return $headers;
    }

    protected function getHealthCheckEndpoint(): string
    {
        return '/customers:listAccessibleCustomers';
    }    /**
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
    }

    /**
     * Verifica se o serviço pode se conectar à API
     */
    public function canConnect(): bool
    {
        if (!$this->customerId || !$this->developerToken || !$this->refreshToken) {
            return false;
        }

        try {
            $this->rateLimiter->checkLimit('google_ads', 'connect');

            $response = $this->retryService->execute(function () {
                return $this->makeRequest('GET', "/customers/{$this->customerId}", [
                    'query' => 'SELECT customer.id, customer.descriptive_name FROM customer LIMIT 1'
                ]);
            });

            return isset($response['results']) && !empty($response['results']);
        } catch (\Throwable $exception) {
            Log::error('Google Ads connection failed', [
                'error' => $exception->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Cria uma nova campanha no Google Ads
     */
    public function createCampaign(CreateADSCampaignDTO $dto): array
    {
        try {
            $this->rateLimiter->checkLimit('google_ads', 'create_campaign');

            $campaignData = GoogleAdsMapper::mapCampaignData($dto);

            $response = $this->retryService->execute(function () use ($campaignData) {
                return $this->makeRequest('POST', "/customers/{$this->customerId}/campaigns:mutate", [
                    'operations' => [
                        [
                            'create' => [
                                'name' => $campaignData['name'],
                                'advertising_channel_type' => $campaignData['advertising_channel_type'],
                                'status' => $campaignData['status'],
                                'campaign_budget' => $campaignData['campaign_budget'],
                                'network_settings' => $campaignData['network_settings'] ?? null,
                                'geoTargeting' => $campaignData['geoTargeting'] ?? null,
                                'languageTargeting' => $campaignData['languageTargeting'] ?? null
                            ]
                        ]
                    ]
                ]);
            });

            Log::info('Google Ads campaign created successfully', [
                'campaign_id' => $response['results'][0]['resource_name'] ?? null,
                'name' => $campaignData['name']
            ]);

            return [
                'success' => true,
                'campaign_id' => $response['results'][0]['resource_name'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to create Google Ads campaign', [
                'error' => $exception->getMessage(),
                'campaign_data' => $dto->toArray()
            ]);

            throw new GoogleAdsApiException(
                'Falha ao criar campanha no Google Ads: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Cria um anúncio de texto para Search
     */
    public function createSearchAd(array $adData): array
    {
        try {
            $this->rateLimiter->checkLimit('google_ads', 'create_ad');

            $response = $this->retryService->execute(function () use ($adData) {
                return $this->makeRequest('POST', "/customers/{$this->customerId}/adGroupAds:mutate", [
                    'operations' => [
                        [
                            'create' => [
                                'ad_group' => $adData['ad_group'],
                                'status' => $adData['status'] ?? 'PAUSED',
                                'ad' => [
                                    'type' => 'EXPANDED_TEXT_AD',
                                    'expanded_text_ad' => [
                                        'headline_part1' => $adData['headline_part1'],
                                        'headline_part2' => $adData['headline_part2'] ?? null,
                                        'description' => $adData['description'],
                                        'path1' => $adData['path1'] ?? null,
                                        'path2' => $adData['path2'] ?? null
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]);
            });

            return [
                'success' => true,
                'ad_id' => $response['results'][0]['resource_name'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to create Google Ads search ad', [
                'error' => $exception->getMessage(),
                'ad_data' => $adData
            ]);

            throw new GoogleAdsApiException(
                'Falha ao criar anúncio de Search: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Cria um anúncio de Display
     */
    public function createDisplayAd(array $adData): array
    {
        try {
            $this->rateLimiter->checkLimit('google_ads', 'create_ad');

            $response = $this->retryService->execute(function () use ($adData) {
                return $this->makeRequest('POST', "/customers/{$this->customerId}/adGroupAds:mutate", [
                    'operations' => [
                        [
                            'create' => [
                                'ad_group' => $adData['ad_group'],
                                'status' => $adData['status'] ?? 'PAUSED',
                                'ad' => [
                                    'type' => 'RESPONSIVE_DISPLAY_AD',
                                    'responsive_display_ad' => [
                                        'marketing_images' => $adData['marketing_images'] ?? [],
                                        'square_marketing_images' => $adData['square_marketing_images'] ?? [],
                                        'logo_images' => $adData['logo_images'] ?? [],
                                        'headlines' => $adData['headlines'] ?? [],
                                        'descriptions' => $adData['descriptions'] ?? [],
                                        'business_name' => $adData['business_name'] ?? null,
                                        'call_to_action_text' => $adData['call_to_action_text'] ?? 'LEARN_MORE'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]);
            });

            return [
                'success' => true,
                'ad_id' => $response['results'][0]['resource_name'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to create Google Ads display ad', [
                'error' => $exception->getMessage(),
                'ad_data' => $adData
            ]);

            throw new GoogleAdsApiException(
                'Falha ao criar anúncio de Display: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Cria um anúncio de Shopping
     */
    public function createShoppingAd(array $adData): array
    {
        try {
            $this->rateLimiter->checkLimit('google_ads', 'create_ad');

            $response = $this->retryService->execute(function () use ($adData) {
                return $this->makeRequest('POST', "/customers/{$this->customerId}/adGroupAds:mutate", [
                    'operations' => [
                        [
                            'create' => [
                                'ad_group' => $adData['ad_group'],
                                'status' => $adData['status'] ?? 'PAUSED',
                                'ad' => [
                                    'type' => 'SHOPPING_PRODUCT_AD',
                                    'shopping_product_ad' => [
                                        'product_channel' => 'ONLINE',
                                        'product_channel_exclusivity' => 'SINGLE_CHANNEL'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]);
            });

            return [
                'success' => true,
                'ad_id' => $response['results'][0]['resource_name'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to create Google Ads shopping ad', [
                'error' => $exception->getMessage(),
                'ad_data' => $adData
            ]);

            throw new GoogleAdsApiException(
                'Falha ao criar anúncio de Shopping: ' . $exception->getMessage(),
                0,
                $exception
            );
        }
    }

    /**
     * Cria um anúncio de YouTube
     */
    public function createYouTubeAd(array $adData): array
    {
        try {
            $this->rateLimiter->checkLimit('google_ads', 'create_ad');

            $response = $this->retryService->execute(function () use ($adData) {
                return $this->makeRequest('POST', "/customers/{$this->customerId}/adGroupAds:mutate", [
                    'operations' => [
                        [
                            'create' => [
                                'ad_group' => $adData['ad_group'],
                                'status' => $adData['status'] ?? 'PAUSED',
                                'ad' => [
                                    'type' => 'VIDEO_RESPONSIVE_AD',
                                    'video_responsive_ad' => [
                                        'videos' => $adData['videos'] ?? [],
                                        'headlines' => $adData['headlines'] ?? [],
                                        'long_headlines' => $adData['long_headlines'] ?? [],
                                        'descriptions' => $adData['descriptions'] ?? [],
                                        'call_to_action_text' => $adData['call_to_action_text'] ?? 'LEARN_MORE'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]);
            });

            return [
                'success' => true,
                'ad_id' => $response['results'][0]['resource_name'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to create Google Ads YouTube ad', [
                'error' => $exception->getMessage(),
                'ad_data' => $adData
            ]);

            throw new GoogleAdsApiException(
                'Falha ao criar anúncio de YouTube: ' . $exception->getMessage(),
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
            $this->rateLimiter->checkLimit('google_ads', 'get_insights');

            $defaultQuery = "
                SELECT 
                    campaign.id,
                    campaign.name,
                    metrics.impressions,
                    metrics.clicks,
                    metrics.cost_micros,
                    metrics.ctr,
                    metrics.average_cpc,
                    metrics.conversions,
                    metrics.cost_per_conversion
                FROM campaign 
                WHERE campaign.id = {$campaignId}
                AND segments.date DURING LAST_30_DAYS
            ";

            $query = $params['query'] ?? $defaultQuery;

            $response = $this->retryService->execute(function () use ($query) {
                return $this->makeRequest('GET', "/customers/{$this->customerId}/googleAds:search", [
                    'query' => $query
                ]);
            });

            return [
                'success' => true,
                'insights' => $response['results'] ?? [],
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to get Google Ads campaign insights', [
                'error' => $exception->getMessage(),
                'campaign_id' => $campaignId,
                'params' => $params
            ]);

            throw new GoogleAdsApiException(
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
            $query = "
                SELECT 
                    metrics.impressions,
                    metrics.clicks,
                    metrics.cost_micros
                FROM campaign 
                WHERE segments.date = '{$this->getToday()}'
            ";

            $response = $this->makeRequest('GET', "/customers/{$this->customerId}/googleAds:search", [
                'query' => $query
            ]);

            $totalImpressions = 0;
            $totalClicks = 0;
            $totalCost = 0;

            foreach ($response['results'] ?? [] as $result) {
                $totalImpressions += $result['metrics']['impressions'] ?? 0;
                $totalClicks += $result['metrics']['clicks'] ?? 0;
                $totalCost += $result['metrics']['cost_micros'] ?? 0;
            }

            return [
                'success' => true,
                'usage' => [
                    'impressions' => $totalImpressions,
                    'clicks' => $totalClicks,
                    'spend' => $totalCost / 1000000 // Converter de micros para moeda
                ],
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Failed to get Google Ads API usage stats', [
                'error' => $exception->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $exception->getMessage()
            ];
        }
    }

    /**
     * Obtém a data de hoje no formato do Google Ads
     */
    private function getToday(): string
    {
        return date('Y-m-d');
    }
}
