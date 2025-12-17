<?php

namespace App\Application\ADStool\UseCases;

use App\Application\ADStool\Commands\SyncADSCampaignCommand;
use App\Domains\ADStool\Services\CampaignService;
use App\Domains\ADStool\Services\AdPlatformIntegrationService;
use App\Domains\ADStool\Domain\ADSCampaign;
use App\Shared\Exceptions\BusinessRuleException;
use Illuminate\Support\Facades\Log;

class SyncADSCampaignUseCase
{
    protected CampaignService $campaignService;
    protected AdPlatformIntegrationService $integrationService;

    public function __construct(
        CampaignService $campaignService,
        AdPlatformIntegrationService $integrationService
    ) {
        $this->campaignService = $campaignService;
        $this->integrationService = $integrationService;
    }

    /**
     * Executa o caso de uso para sincronizar uma campanha com a plataforma de anúncios.
     *
     * @param SyncADSCampaignCommand $command
     * @return ADSCampaign
     * @throws BusinessRuleException
     */
    public function execute(SyncADSCampaignCommand $command): ADSCampaign
    {
        $campaign = $this->campaignService->getCampaignById($command->campaignId);
        
        if (!$campaign) {
            throw new BusinessRuleException('Campaign not found');
        }

        // Check if campaign can be synced
        if (!$this->canSyncCampaign($campaign)) {
            throw new BusinessRuleException('Campaign cannot be synced in its current status');
        }

        try {
            // Mark campaign as syncing
            $campaign->markAsSyncing();
            $this->campaignService->updateCampaign($command->campaignId, [
                'sync_status' => $campaign->syncStatus,
                'updated_at' => $campaign->updatedAt
            ]);

            // Sync with platform
            $syncResult = $this->integrationService->syncCampaign($campaign);

            if ($syncResult['success']) {
                // Mark as synced
                $campaign->markAsSynced(
                    $syncResult['platform_campaign_id'],
                    $syncResult['platform_status']
                );
                
                Log::info("Campaign {$command->campaignId} synced successfully with platform");
            } else {
                // Mark as failed
                $campaign->markSyncFailed($syncResult['error_message']);
                
                Log::error("Campaign {$command->campaignId} sync failed: {$syncResult['error_message']}");
            }

            // Save the campaign
            $updatedCampaign = $this->campaignService->updateCampaign($command->campaignId, [
                'sync_status' => $campaign->syncStatus,
                'platform_campaign_id' => $campaign->platformCampaignId,
                'platform_status' => $campaign->platformStatus,
                'error_message' => $campaign->errorMessage,
                'updated_at' => $campaign->updatedAt
            ]);

            return $updatedCampaign;

        } catch (\Exception $e) {
            // Mark as failed
            $campaign->markSyncFailed($e->getMessage());
            
            $this->campaignService->updateCampaign($command->campaignId, [
                'sync_status' => $campaign->syncStatus,
                'error_message' => $campaign->errorMessage,
                'updated_at' => $campaign->updatedAt
            ]);

            Log::error("Campaign {$command->campaignId} sync failed with exception: {$e->getMessage()}");
            
            throw new BusinessRuleException("Campaign sync failed: {$e->getMessage()}");
        }
    }

    /**
     * Verifica se a campanha pode ser sincronizada.
     *
     * @param ADSCampaign $campaign
     * @return bool
     */
    private function canSyncCampaign(ADSCampaign $campaign): bool
    {
        // Cannot sync if already syncing
        if ($campaign->isSyncInProgress()) {
            return false;
        }

        // Cannot sync if archived
        if ($campaign->isArchived()) {
            return false;
        }

        return true;
    }
}