<?php

namespace App\Application\ADStool\Orchestrators;

use App\Domains\ADStool\Contracts\AdsPlatformService;
use App\Domains\ADStool\DTOs\CampaignCreationResult;
use App\Domains\ADStool\Exceptions\CampaignCreationException;
use App\Domains\ADStool\Exceptions\FacebookAdsApiException;
use App\Domains\ADStool\Exceptions\GoogleAdsApiException;
use DateTimeInterface;
use Illuminate\Support\Facades\Log;

class ADSToolOrchestrator
{
    /** @var iterable<AdsPlatformService> */
    private iterable $adsPlatformServices;

    /**
     * @param iterable<AdsPlatformService> $adsPlatformServices
     */
    public function __construct(iterable $adsPlatformServices)
    {
        $this->adsPlatformServices = $adsPlatformServices;
    }

    public function createCampaign(string $name, float $budget, DateTimeInterface $startDate, DateTimeInterface $endDate): CampaignCreationResult
    {
        Log::info("ADSToolService: Creating campaign '{$name}'.");

        $results = new CampaignCreationResult(0, 'PENDING');

        foreach ($this->adsPlatformServices as $platformService) {
            $platformName = $platformService->getPlatformName();
            try {
                $campaignId = $platformService->createCampaign($name, $budget, $startDate, $endDate);

                if ($platformName === 'Google Ads') {
                    $results->googleAdsCampaignId = $campaignId;
                } elseif ($platformName === 'Facebook Ads') {
                    $results->facebookAdsCampaignId = $campaignId;
                }
            } catch (GoogleAdsApiException $e) {
                throw new CampaignCreationException('Falha ao criar campanha no Google Ads: ' . $e->getMessage(), 0, $e);
            } catch (FacebookAdsApiException $e) {
                throw new CampaignCreationException('Falha ao criar campanha no Facebook Ads: ' . $e->getMessage(), 0, $e);
            } catch (\Exception $e) {
                throw new CampaignCreationException("Ocorreu um erro inesperado na plataforma {$platformName}: " . $e->getMessage(), 0, $e);
            }
        }

        Log::info("ADSToolService: Campanha '{$name}' criada com sucesso em todas as plataformas.", [
            'google_ads_id' => $results->googleAdsCampaignId,
            'facebook_ads_id' => $results->facebookAdsCampaignId,
        ]);

        return $results;
    }
}
