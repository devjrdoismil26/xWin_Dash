<?php

namespace App\Domains\ADStool\Application\Handlers;

use App\Domains\ADStool\Application\Queries\GetADSCampaignQuery;
use App\Domains\ADStool\Domain\Repositories\ADSCampaignRepositoryInterface;
use App\Domains\ADStool\Domain\Services\ADSCampaignServiceInterface;
use App\Domains\ADStool\Domain\ValueObjects\ADSCampaignId;
use App\Domains\ADStool\Domain\Exceptions\ADSCampaignNotFoundException;
use Illuminate\Support\Facades\Log;

class GetADSCampaignHandler
{
    public function __construct(
        private ADSCampaignRepositoryInterface $campaignRepository,
        private ADSCampaignServiceInterface $campaignService
    ) {
    }

    public function handle(GetADSCampaignQuery $query)
    {
        try {
            // Buscar a campanha
            $campaignId = new ADSCampaignId($query->campaignId);
            $campaign = $this->campaignRepository->findById($campaignId);

            if (!$campaign) {
                throw new ADSCampaignNotFoundException("Campaign with ID {$query->campaignId} not found");
            }

            // Verificar se o usuário tem acesso à campanha
            if ($campaign->getUserId() !== $query->userId) {
                throw new ADSCampaignNotFoundException("Campaign not found or access denied");
            }

            // Enriquecer com dados adicionais se solicitado
            if ($query->includeAnalytics) {
                try {
                    $analytics = $this->campaignService->getCampaignAnalytics($campaignId);
                    $campaign->setAnalytics($analytics);
                } catch (\Exception $e) {
                    Log::warning('Failed to load analytics for campaign', [
                        'campaign_id' => $query->campaignId,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            if ($query->includeCreatives) {
                try {
                    $creatives = $this->campaignService->getCampaignCreatives($campaignId);
                    $campaign->setCreatives($creatives);
                } catch (\Exception $e) {
                    Log::warning('Failed to load creatives for campaign', [
                        'campaign_id' => $query->campaignId,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            if ($query->includeAccount) {
                try {
                    $account = $this->campaignService->getCampaignAccount($campaignId);
                    $campaign->setAccount($account);
                } catch (\Exception $e) {
                    Log::warning('Failed to load account for campaign', [
                        'campaign_id' => $query->campaignId,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            if ($query->includePerformance) {
                try {
                    $performance = $this->campaignService->getCampaignPerformance($campaignId);
                    $campaign->setPerformance($performance);
                } catch (\Exception $e) {
                    Log::warning('Failed to load performance for campaign', [
                        'campaign_id' => $query->campaignId,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            Log::info('ADS Campaign retrieved successfully', [
                'campaign_id' => $query->campaignId,
                'user_id' => $query->userId,
                'include_analytics' => $query->includeAnalytics,
                'include_creatives' => $query->includeCreatives,
                'include_account' => $query->includeAccount,
                'include_performance' => $query->includePerformance
            ]);

            return $campaign;
        } catch (\Exception $e) {
            Log::error('Failed to get ADS campaign', [
                'campaign_id' => $query->campaignId,
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
