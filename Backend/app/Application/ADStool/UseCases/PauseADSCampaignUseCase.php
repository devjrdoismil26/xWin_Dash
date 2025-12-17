<?php

namespace App\Application\ADStool\UseCases;

use App\Application\ADStool\Commands\PauseADSCampaignCommand;
use App\Domains\ADStool\Services\CampaignService;
use App\Domains\ADStool\Domain\ADSCampaign;
use App\Shared\Exceptions\BusinessRuleException;

class PauseADSCampaignUseCase
{
    protected CampaignService $campaignService;

    public function __construct(CampaignService $campaignService)
    {
        $this->campaignService = $campaignService;
    }

    /**
     * Executa o caso de uso para pausar uma campanha de anúncios.
     *
     * @param PauseADSCampaignCommand $command
     * @return ADSCampaign
     * @throws BusinessRuleException
     */
    public function execute(PauseADSCampaignCommand $command): ADSCampaign
    {
        $campaign = $this->campaignService->getCampaignById($command->campaignId);
        
        if (!$campaign) {
            throw new BusinessRuleException('Campaign not found');
        }

        if (!$campaign->canBePaused()) {
            throw new BusinessRuleException('Campaign cannot be paused in its current status');
        }

        // Pause the campaign
        $campaign->pause();
        
        // Save the campaign
        $updatedCampaign = $this->campaignService->updateCampaign($command->campaignId, [
            'status' => $campaign->status,
            'updated_at' => $campaign->updatedAt
        ]);

        return $updatedCampaign;
    }
}