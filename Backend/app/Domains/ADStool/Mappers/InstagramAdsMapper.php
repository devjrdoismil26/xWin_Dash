<?php

namespace App\Domains\ADStool\Mappers;

use App\Domains\ADStool\DTOs\CreateADSCampaignDTO;
use App\Domains\ADStool\DTOs\PlatformCampaignResultDTO;

/**
 * 🚀 Instagram Ads Mapper
 *
 * Mapper para traduzir dados entre o domínio da nossa aplicação e a API do Instagram Ads
 * Inclui mapeamentos específicos para Stories, Reels, IGTV e Feed
 */
class InstagramAdsMapper
{
    /**
     * Mapeia um DTO de criação de campanha do nosso domínio para o formato da API do Instagram.
     */
    public static function toPlatformCreationData(CreateADSCampaignDTO $dto): array
    {
        $baseData = [
            'name' => $dto->name,
            'objective' => self::mapObjective($dto->objective),
            'status' => 'PAUSED', // Boa prática criar campanhas pausadas para revisão
            'daily_budget' => $dto->budget * 100, // Instagram espera o orçamento em centavos
            'special_ad_categories' => [],
        ];

        // Adicionar configurações específicas do Instagram
        if (isset($dto->targeting['instagram_placement'])) {
            $baseData['instagram_placement'] = $dto->targeting['instagram_placement'];
        }

        // Adicionar configurações de criativo específicas do Instagram
        if (isset($dto->creatives['instagram_specific'])) {
            $baseData['instagram_specific'] = $dto->creatives['instagram_specific'];
        }

        return $baseData;
    }

    /**
     * Mapeia a resposta da API do Instagram para um DTO de resultado padronizado.
     */
    public static function fromPlatformResponse(array $apiResponse): PlatformCampaignResultDTO
    {
        return new PlatformCampaignResultDTO(
            $apiResponse['id'],
            $apiResponse['status'] ?? 'UNKNOWN',
            $apiResponse['name'] ?? 'Untitled',
            $apiResponse,
        );
    }

    /**
     * Traduz o nosso objetivo de campanha interno para um objetivo válido na API do Instagram.
     */
    private static function mapObjective(string $internalObjective): string
    {
        $map = [
            'traffic' => 'LINK_CLICKS',
            'conversions' => 'CONVERSIONS',
            'brand_awareness' => 'BRAND_AWARENESS',
            'reach' => 'REACH',
            'engagement' => 'POST_ENGAGEMENT',
            'video_views' => 'VIDEO_VIEWS',
            'app_installs' => 'APP_INSTALLS',
            'lead_generation' => 'LEAD_GENERATION',
            'messages' => 'MESSAGES',
            'catalog_sales' => 'CATALOG_SALES',
            'store_traffic' => 'STORE_TRAFFIC',
        ];

        return $map[strtolower($internalObjective)] ?? 'LINK_CLICKS';
    }

    /**
     * Mapeia dados para criação de Ad Set específico do Instagram
     */
    public static function toAdSetData(array $adSetData): array
    {
        $baseData = [
            'name' => $adSetData['name'],
            'campaign_id' => $adSetData['campaign_id'],
            'billing_event' => 'IMPRESSIONS',
            'optimization_goal' => self::mapOptimizationGoal($adSetData['optimization_goal'] ?? 'REACH'),
            'bid_strategy' => 'LOWEST_COST_WITHOUT_CAP',
            'daily_budget' => ($adSetData['daily_budget'] ?? 100) * 100, // Converter para centavos
            'status' => 'PAUSED',
        ];

        // Adicionar targeting específico do Instagram
        if (isset($adSetData['targeting'])) {
            $baseData['targeting'] = self::mapTargeting($adSetData['targeting']);
        }

        // Adicionar placement específico do Instagram
        if (isset($adSetData['instagram_placement'])) {
            $baseData['publisher_platforms'] = ['instagram'];
            $baseData['instagram_positions'] = $adSetData['instagram_placement'];
        }

        return $baseData;
    }

    /**
     * Mapeia dados para criação de anúncio específico do Instagram
     */
    public static function toAdData(array $adData, string $adType = 'feed'): array
    {
        $baseData = [
            'name' => $adData['name'],
            'adset_id' => $adData['adset_id'],
            'status' => 'PAUSED',
        ];

        // Mapear criativo baseado no tipo de anúncio
        switch ($adType) {
            case 'stories':
                $baseData['creative'] = self::mapStoriesCreative($adData);
                break;
            case 'reels':
                $baseData['creative'] = self::mapReelsCreative($adData);
                break;
            case 'igtv':
                $baseData['creative'] = self::mapIGTVCreative($adData);
                break;
            case 'feed':
            default:
                $baseData['creative'] = self::mapFeedCreative($adData);
                break;
        }

        return $baseData;
    }

    /**
     * Mapeia criativo para Stories
     */
    private static function mapStoriesCreative(array $adData): array
    {
        return [
            'object_story_spec' => [
                'page_id' => $adData['page_id'],
                'instagram_actor_id' => $adData['instagram_account_id'],
                'link_data' => [
                    'link' => $adData['link'] ?? '',
                    'message' => $adData['message'] ?? '',
                    'image_hash' => $adData['image_hash'] ?? '',
                    'call_to_action' => [
                        'type' => $adData['cta_type'] ?? 'LEARN_MORE',
                        'value' => [
                            'link' => $adData['link'] ?? ''
                        ]
                    ]
                ]
            ]
        ];
    }

    /**
     * Mapeia criativo para Reels
     */
    private static function mapReelsCreative(array $adData): array
    {
        return [
            'object_story_spec' => [
                'page_id' => $adData['page_id'],
                'instagram_actor_id' => $adData['instagram_account_id'],
                'video_data' => [
                    'video_id' => $adData['video_id'] ?? '',
                    'message' => $adData['message'] ?? '',
                    'call_to_action' => [
                        'type' => $adData['cta_type'] ?? 'LEARN_MORE',
                        'value' => [
                            'link' => $adData['link'] ?? ''
                        ]
                    ]
                ]
            ]
        ];
    }

    /**
     * Mapeia criativo para IGTV
     */
    private static function mapIGTVCreative(array $adData): array
    {
        return [
            'object_story_spec' => [
                'page_id' => $adData['page_id'],
                'instagram_actor_id' => $adData['instagram_account_id'],
                'video_data' => [
                    'video_id' => $adData['video_id'] ?? '',
                    'message' => $adData['message'] ?? '',
                    'title' => $adData['title'] ?? '',
                    'description' => $adData['description'] ?? '',
                    'call_to_action' => [
                        'type' => $adData['cta_type'] ?? 'LEARN_MORE',
                        'value' => [
                            'link' => $adData['link'] ?? ''
                        ]
                    ]
                ]
            ]
        ];
    }

    /**
     * Mapeia criativo para Feed
     */
    private static function mapFeedCreative(array $adData): array
    {
        return [
            'object_story_spec' => [
                'page_id' => $adData['page_id'],
                'instagram_actor_id' => $adData['instagram_account_id'],
                'link_data' => [
                    'link' => $adData['link'] ?? '',
                    'message' => $adData['message'] ?? '',
                    'image_hash' => $adData['image_hash'] ?? '',
                    'name' => $adData['name'] ?? '',
                    'description' => $adData['description'] ?? '',
                    'call_to_action' => [
                        'type' => $adData['cta_type'] ?? 'LEARN_MORE',
                        'value' => [
                            'link' => $adData['link'] ?? ''
                        ]
                    ]
                ]
            ]
        ];
    }

    /**
     * Mapeia objetivo de otimização
     */
    private static function mapOptimizationGoal(string $goal): string
    {
        $map = [
            'reach' => 'REACH',
            'impressions' => 'IMPRESSIONS',
            'clicks' => 'LINK_CLICKS',
            'conversions' => 'CONVERSIONS',
            'engagement' => 'POST_ENGAGEMENT',
            'video_views' => 'VIDEO_VIEWS',
            'app_installs' => 'APP_INSTALLS',
            'lead_generation' => 'LEAD_GENERATION',
        ];

        return $map[strtoupper($goal)] ?? 'REACH';
    }

    /**
     * Mapeia targeting específico do Instagram
     */
    private static function mapTargeting(array $targeting): array
    {
        $mappedTargeting = [];

        // Demografia
        if (isset($targeting['age_min'])) {
            $mappedTargeting['age_min'] = $targeting['age_min'];
        }
        if (isset($targeting['age_max'])) {
            $mappedTargeting['age_max'] = $targeting['age_max'];
        }
        if (isset($targeting['genders'])) {
            $mappedTargeting['genders'] = $targeting['genders'];
        }

        // Localização
        if (isset($targeting['geo_locations'])) {
            $mappedTargeting['geo_locations'] = $targeting['geo_locations'];
        }

        // Interesses
        if (isset($targeting['interests'])) {
            $mappedTargeting['interests'] = $targeting['interests'];
        }

        // Comportamentos
        if (isset($targeting['behaviors'])) {
            $mappedTargeting['behaviors'] = $targeting['behaviors'];
        }

        // Conexões
        if (isset($targeting['connections'])) {
            $mappedTargeting['connections'] = $targeting['connections'];
        }

        return $mappedTargeting;
    }

    /**
     * Mapeia insights do Instagram para formato padronizado
     */
    public static function mapInsights(array $insights): array
    {
        return [
            'impressions' => $insights['impressions'] ?? 0,
            'clicks' => $insights['clicks'] ?? 0,
            'spend' => $insights['spend'] ?? 0,
            'reach' => $insights['reach'] ?? 0,
            'frequency' => $insights['frequency'] ?? 0,
            'cpm' => $insights['cpm'] ?? 0,
            'cpc' => $insights['cpc'] ?? 0,
            'ctr' => $insights['ctr'] ?? 0,
            'cpp' => $insights['cpp'] ?? 0,
            'cost_per_conversion' => $insights['cost_per_conversion'] ?? 0,
            'conversions' => $insights['conversions'] ?? 0,
            'conversion_values' => $insights['conversion_values'] ?? 0,
            'instagram_impressions' => $insights['instagram_impressions'] ?? 0,
            'instagram_clicks' => $insights['instagram_clicks'] ?? 0,
            'instagram_reach' => $insights['instagram_reach'] ?? 0,
        ];
    }
}
