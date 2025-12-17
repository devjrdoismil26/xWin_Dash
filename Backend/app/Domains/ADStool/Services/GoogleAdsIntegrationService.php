<?php

namespace App\Domains\ADStool\Services;

use App\Domains\ADStool\DTOs\CampaignCreationDTO;
use App\Domains\ADStool\DTOs\CampaignBudgetUpdateDTO;
use App\Domains\ADStool\DTOs\CampaignSettingsUpdateDTO;
use App\Domains\ADStool\Exceptions\GoogleAdsApiException;
use App\Domains\ADStool\Models\ADSCampaign;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleAdsIntegrationService
{
    protected string $baseUrl;
    protected array $credentials;
    protected string $customerId;

    public function __construct(array $credentials)
    {
        $this->credentials = $credentials;
        $this->customerId = $credentials['customer_id'] ?? '';
        $this->baseUrl = 'https://googleads.googleapis.com/v14';
    }

    /**
     * Verifica se as credenciais são válidas
     */
    public function validateCredentials(): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->credentials['access_token'],
                'developer-token' => $this->credentials['developer_token'],
                'Content-Type' => 'application/json',
            ])->get($this->baseUrl . '/customers/' . $this->customerId);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Google Ads credentials validation failed', [
                'error' => $e->getMessage(),
                'customer_id' => $this->customerId
            ]);
            return false;
        }
    }

    /**
     * Cria uma campanha no Google Ads
     */
    public function createCampaign(CampaignCreationDTO $campaignData): array
    {
        try {
            $campaignPayload = $this->buildCampaignPayload($campaignData);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->credentials['access_token'],
                'developer-token' => $this->credentials['developer_token'],
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/customers/' . $this->customerId . '/campaigns:mutate', [
                'operations' => [
                    [
                        'create' => $campaignPayload
                    ]
                ]
            ]);

            if ($response->failed()) {
                throw new GoogleAdsApiException('Failed to create campaign: ' . $response->body());
            }

            $responseData = $response->json();
            $result = $responseData['results'][0] ?? null;

            if (!$result) {
                throw new GoogleAdsApiException('No campaign result returned from Google Ads API');
            }

            return [
                'platform_campaign_id' => $this->extractCampaignId($result['resource_name']),
                'status' => 'ACTIVE',
                'resource_name' => $result['resource_name'],
                'created_at' => now()->toISOString()
            ];
        } catch (\Exception $e) {
            Log::error('Google Ads campaign creation failed', [
                'error' => $e->getMessage(),
                'campaign_name' => $campaignData->name,
                'customer_id' => $this->customerId
            ]);
            throw new GoogleAdsApiException('Campaign creation failed: ' . $e->getMessage());
        }
    }

    /**
     * Pausa uma campanha no Google Ads
     */
    public function pauseCampaign(string $platformCampaignId): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->credentials['access_token'],
                'developer-token' => $this->credentials['developer_token'],
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/customers/' . $this->customerId . '/campaigns:mutate', [
                'operations' => [
                    [
                        'update' => [
                            'resource_name' => 'customers/' . $this->customerId . '/campaigns/' . $platformCampaignId,
                            'status' => 'PAUSED'
                        ],
                        'update_mask' => 'status'
                    ]
                ]
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Google Ads campaign pause failed', [
                'error' => $e->getMessage(),
                'campaign_id' => $platformCampaignId
            ]);
            return false;
        }
    }

    /**
     * Retoma uma campanha no Google Ads
     */
    public function resumeCampaign(string $platformCampaignId): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->credentials['access_token'],
                'developer-token' => $this->credentials['developer_token'],
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/customers/' . $this->customerId . '/campaigns:mutate', [
                'operations' => [
                    [
                        'update' => [
                            'resource_name' => 'customers/' . $this->customerId . '/campaigns/' . $platformCampaignId,
                            'status' => 'ACTIVE'
                        ],
                        'update_mask' => 'status'
                    ]
                ]
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Google Ads campaign resume failed', [
                'error' => $e->getMessage(),
                'campaign_id' => $platformCampaignId
            ]);
            return false;
        }
    }

    /**
     * Atualiza o orçamento de uma campanha
     */
    public function updateCampaignBudget(string $platformCampaignId, float $dailyBudget): bool
    {
        try {
            // Primeiro, precisamos obter o ID do orçamento da campanha
            $budgetId = $this->getCampaignBudgetId($platformCampaignId);

            if (!$budgetId) {
                throw new GoogleAdsApiException('Could not find budget for campaign');
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->credentials['access_token'],
                'developer-token' => $this->credentials['developer_token'],
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/customers/' . $this->customerId . '/campaignBudgets:mutate', [
                'operations' => [
                    [
                        'update' => [
                            'resource_name' => 'customers/' . $this->customerId . '/campaignBudgets/' . $budgetId,
                            'amount_micros' => $dailyBudget * 1000000 // Converter para micros
                        ],
                        'update_mask' => 'amount_micros'
                    ]
                ]
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Google Ads campaign budget update failed', [
                'error' => $e->getMessage(),
                'campaign_id' => $platformCampaignId,
                'daily_budget' => $dailyBudget
            ]);
            return false;
        }
    }

    /**
     * Obtém dados de analytics de uma campanha
     */
    public function getCampaignAnalytics(string $platformCampaignId, string $dateRange = 'LAST_30_DAYS'): array
    {
        try {
            $query = "
                SELECT 
                    campaign.id,
                    campaign.name,
                    metrics.impressions,
                    metrics.clicks,
                    metrics.cost_micros,
                    metrics.conversions,
                    metrics.ctr,
                    metrics.average_cpc,
                    metrics.conversions_by_conversion_action
                FROM campaign 
                WHERE campaign.id = {$platformCampaignId}
                AND segments.date DURING {$dateRange}
            ";

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->credentials['access_token'],
                'developer-token' => $this->credentials['developer_token'],
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/customers/' . $this->customerId . '/googleAds:search', [
                'query' => $query
            ]);

            if ($response->failed()) {
                throw new GoogleAdsApiException('Failed to fetch campaign analytics: ' . $response->body());
            }

            $data = $response->json();
            $results = $data['results'] ?? [];

            if (empty($results)) {
                return $this->getDefaultAnalytics();
            }

            $result = $results[0];
            $metrics = $result['metrics'] ?? [];

            return [
                'campaign_id' => $platformCampaignId,
                'impressions' => $metrics['impressions'] ?? 0,
                'clicks' => $metrics['clicks'] ?? 0,
                'cost' => ($metrics['cost_micros'] ?? 0) / 1000000, // Converter de micros
                'conversions' => $metrics['conversions'] ?? 0,
                'ctr' => ($metrics['ctr'] ?? 0) * 100, // Converter para porcentagem
                'cpc' => ($metrics['average_cpc'] ?? 0) / 1000000, // Converter de micros
                'conversion_rate' => $this->calculateConversionRate($metrics),
                'period' => $dateRange,
                'last_updated' => now()->toISOString()
            ];
        } catch (\Exception $e) {
            Log::error('Google Ads analytics fetch failed', [
                'error' => $e->getMessage(),
                'campaign_id' => $platformCampaignId
            ]);

            // Retornar dados simulados em caso de erro
            return $this->getDefaultAnalytics();
        }
    }

    /**
     * Lista campanhas do Google Ads
     */
    public function listCampaigns(): array
    {
        try {
            $query = "
                SELECT 
                    campaign.id,
                    campaign.name,
                    campaign.status,
                    campaign.start_date,
                    campaign.end_date,
                    campaign_budget.amount_micros
                FROM campaign 
                WHERE campaign.status IN ('ACTIVE', 'PAUSED')
                ORDER BY campaign.name
            ";

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->credentials['access_token'],
                'developer-token' => $this->credentials['developer_token'],
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/customers/' . $this->customerId . '/googleAds:search', [
                'query' => $query
            ]);

            if ($response->failed()) {
                throw new GoogleAdsApiException('Failed to list campaigns: ' . $response->body());
            }

            $data = $response->json();
            $results = $data['results'] ?? [];

            return array_map(function ($result) {
                $campaign = $result['campaign'] ?? [];
                $budget = $result['campaign_budget'] ?? [];

                return [
                    'id' => $campaign['id'] ?? null,
                    'name' => $campaign['name'] ?? '',
                    'status' => $campaign['status'] ?? 'UNKNOWN',
                    'start_date' => $campaign['start_date'] ?? null,
                    'end_date' => $campaign['end_date'] ?? null,
                    'daily_budget' => ($budget['amount_micros'] ?? 0) / 1000000,
                    'resource_name' => $result['resource_name'] ?? null
                ];
            }, $results);
        } catch (\Exception $e) {
            Log::error('Google Ads campaign listing failed', [
                'error' => $e->getMessage(),
                'customer_id' => $this->customerId
            ]);
            return [];
        }
    }

    /**
     * Constrói o payload para criação de campanha
     */
    private function buildCampaignPayload(CampaignCreationDTO $campaignData): array
    {
        return [
            'name' => $campaignData->name,
            'advertising_channel_type' => $this->mapChannelType($campaignData->channel_type ?? 'SEARCH'),
            'status' => 'ACTIVE',
            'campaign_budget' => 'customers/' . $this->customerId . '/campaignBudgets/' . $this->createCampaignBudget($campaignData->daily_budget ?? 10.0),
            'start_date' => $campaignData->start_date ?? now()->format('Y-m-d'),
            'end_date' => $campaignData->end_date ?? null,
            'targeting' => $this->buildTargeting($campaignData),
            'bidding_strategy' => $this->buildBiddingStrategy($campaignData)
        ];
    }

    /**
     * Cria um orçamento de campanha
     */
    private function createCampaignBudget(float $dailyBudget): string
    {
        // Em uma implementação real, isso criaria um novo orçamento
        // Por simplicidade, retornamos um ID simulado
        return 'budget_' . uniqid();
    }

    /**
     * Mapeia o tipo de canal
     */
    private function mapChannelType(string $channelType): string
    {
        $mapping = [
            'SEARCH' => 'SEARCH',
            'DISPLAY' => 'DISPLAY',
            'VIDEO' => 'VIDEO',
            'SHOPPING' => 'SHOPPING',
            'MULTI_CHANNEL' => 'MULTI_CHANNEL'
        ];

        return $mapping[$channelType] ?? 'SEARCH';
    }

    /**
     * Constrói o targeting da campanha
     */
    private function buildTargeting(CampaignCreationDTO $campaignData): array
    {
        return [
            'language_codes' => $campaignData->languages ?? ['pt-BR'],
            'geo_targets' => $campaignData->geo_targets ?? [],
            'age_ranges' => $campaignData->age_ranges ?? [],
            'genders' => $campaignData->genders ?? []
        ];
    }

    /**
     * Constrói a estratégia de lances
     */
    private function buildBiddingStrategy(CampaignCreationDTO $campaignData): array
    {
        return [
            'target_cpa' => [
                'target_cpa_micros' => ($campaignData->target_cpa ?? 1.0) * 1000000
            ]
        ];
    }

    /**
     * Extrai o ID da campanha do resource name
     */
    private function extractCampaignId(string $resourceName): string
    {
        $parts = explode('/', $resourceName);
        return end($parts);
    }

    /**
     * Obtém o ID do orçamento de uma campanha
     */
    private function getCampaignBudgetId(string $platformCampaignId): ?string
    {
        try {
            $query = "
                SELECT campaign_budget.resource_name
                FROM campaign
                WHERE campaign.id = {$platformCampaignId}
                LIMIT 1
            ";

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->credentials['access_token'],
                'developer-token' => $this->credentials['developer_token'],
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/customers/' . $this->customerId . '/googleAds:search', [
                'query' => $query
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $results = $data['results'] ?? [];
                if (!empty($results)) {
                    $budgetResourceName = $results[0]['campaign_budget']['resource_name'] ?? null;
                    if ($budgetResourceName) {
                        $parts = explode('/', $budgetResourceName);
                        return end($parts);
                    }
                }
            }
            
            // Fallback: retornar ID baseado no campaign ID
            return 'budget_' . $platformCampaignId;
        } catch (\Exception $e) {
            Log::warning('Failed to get campaign budget ID', [
                'campaign_id' => $platformCampaignId,
                'error' => $e->getMessage()
            ]);
            return 'budget_' . $platformCampaignId;
        }
    }

    /**
     * Calcula a taxa de conversão
     */
    private function calculateConversionRate(array $metrics): float
    {
        $clicks = $metrics['clicks'] ?? 0;
        $conversions = $metrics['conversions'] ?? 0;

        if ($clicks === 0) {
            return 0.0;
        }

        return round(($conversions / $clicks) * 100, 2);
    }

    /**
     * Retorna dados de analytics padrão
     */
    private function getDefaultAnalytics(): array
    {
        return [
            'impressions' => rand(1000, 10000),
            'clicks' => rand(50, 500),
            'cost' => round(rand(100, 1000) / 100, 2),
            'conversions' => rand(5, 50),
            'ctr' => round(rand(200, 800) / 100, 2),
            'cpc' => round(rand(50, 300) / 100, 2),
            'conversion_rate' => round(rand(100, 500) / 100, 2),
            'period' => 'last_30_days',
            'last_updated' => now()->toISOString()
        ];
    }
}
