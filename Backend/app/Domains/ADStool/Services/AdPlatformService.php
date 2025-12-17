<?php

namespace App\Domains\ADStool\Services;

use App\Domains\ADStool\Contracts\AdsPlatformService as AdsPlatformServiceInterface;
use DateTimeInterface;

/**
 * Serviço para gerenciar a lógica de negócio sobre as plataformas de anúncio.
 *
 * Este serviço fornece informações sobre as plataformas suportadas, suas capacidades,
 * configurações, e outras lógicas de negócio que não envolvem a comunicação direta
 * com as APIs externas (que é responsabilidade do AdPlatformIntegrationService).
 */
class AdPlatformService implements AdsPlatformServiceInterface
{
    /**
     * @var array<string, array<string, mixed>> as configurações das plataformas, geralmente carregadas de um arquivo de configuração
     */
    protected array $platformsConfig;

    public function __construct()
    {
        // Em um cenário real, isso viria de um arquivo de configuração, ex: config/social_platforms.php
        $this->platformsConfig = [
            'facebook' => [
                'name' => 'Facebook Ads',
                'objectives' => ['LINK_CLICKS', 'CONVERSIONS', 'BRAND_AWARENESS'],
                'targeting_options' => ['location', 'age', 'gender', 'interests'],
            ],
            'google' => [
                'name' => 'Google Ads',
                'objectives' => ['SEARCH', 'DISPLAY', 'PERFORMANCE_MAX'],
                'targeting_options' => ['location', 'keyword', 'topic'],
            ],
        ];
    }

    /**
     * Cria uma campanha (implementação da interface).
     */
    public function createCampaign(string $name, float $budget, DateTimeInterface $startDate, DateTimeInterface $endDate): string
    {
        // Implementação básica - retorna um ID temporário
        return 'campaign_' . uniqid();
    }

    /**
     * Retorna o nome da plataforma (implementação da interface).
     */
    public function getPlatformName(): string
    {
        return 'Multi-Platform Service';
    }

    /**
     * Retorna uma lista de todas as plataformas suportadas.
     *
     * @return array<int, array<string, string>>
     */
    public function getSupportedPlatforms(): array
    {
        return array_values(array_map(fn ($config) => [
            'key' => $config['name'],
            'name' => $config['name'],
        ], $this->platformsConfig));
    }

    /**
     * Retorna os detalhes de configuração para uma plataforma específica.
     *
     * @param string $platformKey
     *
     * @return array<string, mixed>|null
     */
    public function getPlatformDetails(string $platformKey): ?array
    {
        return $this->platformsConfig[strtolower($platformKey)] ?? null;
    }

    /**
     * Valida se um objetivo de campanha é válido para uma determinada plataforma.
     *
     * @param string $platformKey
     * @param string $objective
     *
     * @return bool
     */
    public function isValidObjectiveForPlatform(string $platformKey, string $objective): bool
    {
        $details = $this->getPlatformDetails($platformKey);
        if (!$details) {
            return false;
        }

        return in_array($objective, $details['objectives']);
    }
}
