<?php

namespace App\Domains\ADStool\Services;

use App\Domains\ADStool\DTOs\CampaignCreationDTO;
use App\Domains\ADStool\Exceptions\GoogleAdsApiException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleAdsCampaignService
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
     * Obtém detalhes de uma campanha específica
     */
    public function getCampaignDetails(string $platformCampaignId): array
    {
        try {
            $query = "
                SELECT 
                    campaign.id,
                    campaign.name,
                    campaign.status,
                    campaign.start_date,
                    campaign.end_date,
                    campaign.advertising_channel_type,
                    campaign_budget.amount_micros,
                    campaign_budget.delivery_method
                FROM campaign 
                WHERE campaign.id = {$platformCampaignId}
            ";

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->credentials['access_token'],
                'developer-token' => $this->credentials['developer_token'],
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/customers/' . $this->customerId . '/googleAds:search', [
                'query' => $query
            ]);

            if ($response->failed()) {
                throw new GoogleAdsApiException('Failed to fetch campaign details: ' . $response->body());
            }

            $data = $response->json();
            $results = $data['results'] ?? [];

            if (empty($results)) {
                throw new GoogleAdsApiException('Campaign not found');
            }

            $result = $results[0];
            $campaign = $result['campaign'] ?? [];
            $budget = $result['campaign_budget'] ?? [];

            return [
                'id' => $campaign['id'] ?? null,
                'name' => $campaign['name'] ?? '',
                'status' => $campaign['status'] ?? 'UNKNOWN',
                'start_date' => $campaign['start_date'] ?? null,
                'end_date' => $campaign['end_date'] ?? null,
                'channel_type' => $campaign['advertising_channel_type'] ?? 'SEARCH',
                'daily_budget' => ($budget['amount_micros'] ?? 0) / 1000000,
                'delivery_method' => $budget['delivery_method'] ?? 'STANDARD',
                'resource_name' => $result['resource_name'] ?? null
            ];
        } catch (\Exception $e) {
            Log::error('Google Ads campaign details fetch failed', [
                'error' => $e->getMessage(),
                'campaign_id' => $platformCampaignId
            ]);
            throw new GoogleAdsApiException('Failed to fetch campaign details: ' . $e->getMessage());
        }
    }

    /**
     * Atualiza configurações de uma campanha
     */
    public function updateCampaignSettings(string $platformCampaignId, array $settings): bool
    {
        try {
            $updateData = [
                'resource_name' => 'customers/' . $this->customerId . '/campaigns/' . $platformCampaignId
            ];

            $updateMask = [];

            if (isset($settings['name'])) {
                $updateData['name'] = $settings['name'];
                $updateMask[] = 'name';
            }

            if (isset($settings['start_date'])) {
                $updateData['start_date'] = $settings['start_date'];
                $updateMask[] = 'start_date';
            }

            if (isset($settings['end_date'])) {
                $updateData['end_date'] = $settings['end_date'];
                $updateMask[] = 'end_date';
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->credentials['access_token'],
                'developer-token' => $this->credentials['developer_token'],
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/customers/' . $this->customerId . '/campaigns:mutate', [
                'operations' => [
                    [
                        'update' => $updateData,
                        'update_mask' => implode(',', $updateMask)
                    ]
                ]
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Google Ads campaign settings update failed', [
                'error' => $e->getMessage(),
                'campaign_id' => $platformCampaignId,
                'settings' => $settings
            ]);
            return false;
        }
    }

    /**
     * Constrói o payload para criação de campanha
     */
    protected function buildCampaignPayload(CampaignCreationDTO $campaignData): array
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
    protected function createCampaignBudget(float $dailyBudget): string
    {
        // Em uma implementação real, isso criaria um novo orçamento
        // Por simplicidade, retornamos um ID simulado
        return 'budget_' . uniqid();
    }

    /**
     * Mapeia o tipo de canal
     */
    protected function mapChannelType(string $channelType): string
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
    protected function buildTargeting(CampaignCreationDTO $campaignData): array
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
    protected function buildBiddingStrategy(CampaignCreationDTO $campaignData): array
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
    protected function extractCampaignId(string $resourceName): string
    {
        $parts = explode('/', $resourceName);
        return end($parts);
    }
}
