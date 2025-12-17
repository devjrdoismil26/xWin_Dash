<?php

namespace App\Application\ADStool\UseCases;

use App\Application\ADStool\Commands\EndADSCampaignCommand;
use App\Domains\ADStool\Services\CampaignService;
use App\Domains\ADStool\Domain\ADSCampaign;
use App\Shared\Exceptions\BusinessRuleException;

class EndADSCampaignUseCase
{
    protected CampaignService $campaignService;

    public function __construct(CampaignService $campaignService)
    {
        $this->campaignService = $campaignService;
    }

    /**
     * Executa o caso de uso para finalizar uma campanha de anúncios.
     *
     * @param EndADSCampaignCommand $command
     * @return ADSCampaign
     * @throws BusinessRuleException
     */
    public function execute(EndADSCampaignCommand $command): ADSCampaign
    {
        $campaign = $this->campaignService->getCampaignById($command->campaignId);
        
        if (!$campaign) {
            throw new BusinessRuleException('Campaign not found');
        }

        if (!$campaign->canBeEnded()) {
            throw new BusinessRuleException('Campaign cannot be ended in its current status');
        }

        // End the campaign
        $campaign->end();
        
        // Save the campaign
        $updatedCampaign = $this->campaignService->updateCampaign($command->campaignId, [
            'status' => $campaign->status,
            'end_date' => $campaign->endDate,
            'updated_at' => $campaign->updatedAt
        ]);

        return $updatedCampaign;
    }
}