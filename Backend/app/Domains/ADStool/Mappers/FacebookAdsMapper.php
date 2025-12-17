<?php

namespace App\Domains\ADStool\Mappers;

use App\Domains\ADStool\DTOs\CreateADSCampaignDTO;
use App\Domains\ADStool\DTOs\PlatformCampaignResultDTO;

/**
 * Mapper para traduzir dados entre o domínio da nossa aplicação e a API do Facebook Ads.
 *
 * Esta classe isola a lógica de transformação de dados, garantindo que o resto da aplicação
 * não precise conhecer a estrutura de dados específica da API do Facebook.
 */
class FacebookAdsMapper
{
    /**
     * Mapeia um DTO de criação de campanha do nosso domínio para o formato de dados da API do Facebook.
     *
     * @param CreateADSCampaignDTO $dto
     *
     * @return array<string, mixed>
     */
    public static function toPlatformCreationData(CreateADSCampaignDTO $dto): array
    {
        return [
            'name' => $dto->name,
            'objective' => self::mapObjective($dto->objective),
            'status' => 'PAUSED', // Boa prática criar campanhas pausadas para revisão
            'daily_budget' => $dto->budget * 100, // Facebook espera o orçamento em centavos
            'special_ad_categories' => [],
            // Outros campos de targeting e criativos seriam mapeados aqui
            // a partir de $dto->targeting e $dto->creatives
        ];
    }

    /**
     * Mapeia a resposta da API do Facebook para um DTO de resultado padronizado.
     *
     * @param array<string, mixed> $apiResponse
     *
     * @return PlatformCampaignResultDTO
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
     * Traduz o nosso objetivo de campanha interno para um objetivo válido na API do Facebook.
     *
     * @param string $internalObjective
     *
     * @return string
     */
    private static function mapObjective(string $internalObjective): string
    {
        $map = [
            'traffic' => 'LINK_CLICKS',
            'conversions' => 'CONVERSIONS',
            'brand_awareness' => 'BRAND_AWARENESS',
            // ... outros mapeamentos
        ];

        return $map[strtolower($internalObjective)] ?? 'LINK_CLICKS';
    }
}
