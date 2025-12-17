<?php

namespace App\Application\ADStool\UseCases;

use App\Application\ADStool\Commands\ActivateADSCampaignCommand;
use App\Domains\ADStool\Services\CampaignService;
use App\Domains\ADStool\Domain\ADSCampaign;
use App\Shared\Exceptions\BusinessRuleException;

class ActivateADSCampaignUseCase
{
    protected CampaignService $campaignService;

    public function __construct(CampaignService $campaignService)
    {
        $this->campaignService = $campaignService;
    }

    /**
     * Executa o caso de uso para ativar uma campanha de anúncios.
     *
     * @param ActivateADSCampaignCommand $command
     * @return ADSCampaign
     * @throws BusinessRuleException
     */
    public function execute(ActivateADSCampaignCommand $command): ADSCampaign
    {
        $campaign = $this->campaignService->getCampaignById($command->campaignId);
        
        if (!$campaign) {
            throw new BusinessRuleException('Campaign not found');
        }

        if (!$campaign->canBeActivated()) {
            throw new BusinessRuleException('Campaign cannot be activated in its current status');
        }

        // Validate campaign requirements before activation
        $this->validateCampaignForActivation($campaign);

        // Activate the campaign
        $campaign->activate();
        
        // Save the campaign
        $updatedCampaign = $this->campaignService->updateCampaign($command->campaignId, [
            'status' => $campaign->status,
            'updated_at' => $campaign->updatedAt
        ]);

        return $updatedCampaign;
    }

    /**
     * Valida se a campanha pode ser ativada.
     *
     * @param ADSCampaign $campaign
     * @throws BusinessRuleException
     */
    private function validateCampaignForActivation(ADSCampaign $campaign): void
    {
        // Check if campaign has valid budget
        if ($campaign->dailyBudget <= 0) {
            throw new BusinessRuleException('Campaign must have a valid daily budget to be activated');
        }

        // Check if campaign has valid date range
        if ($campaign->startDate && $campaign->startDate < new \DateTime()) {
            throw new BusinessRuleException('Campaign start date cannot be in the past');
        }

        // Check if campaign has valid end date
        if ($campaign->startDate && $campaign->endDate && $campaign->startDate >= $campaign->endDate) {
            throw new BusinessRuleException('Campaign end date must be after start date');
        }

        // Check if campaign has required platform data
        if (empty($campaign->platformSpecificData)) {
            throw new BusinessRuleException('Campaign must have platform-specific data to be activated');
        }
    }
}