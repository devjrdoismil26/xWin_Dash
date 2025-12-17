<?php

namespace App\Application\ADStool\UseCases;

use App\Application\ADStool\Commands\UpdateADSCampaignBudgetCommand;
use App\Domains\ADStool\Services\CampaignService;
use App\Domains\ADStool\Domain\ADSCampaign;
use App\Shared\Exceptions\BusinessRuleException;

class UpdateADSCampaignBudgetUseCase
{
    protected CampaignService $campaignService;

    public function __construct(CampaignService $campaignService)
    {
        $this->campaignService = $campaignService;
    }

    /**
     * Executa o caso de uso para atualizar o orçamento de uma campanha de anúncios.
     *
     * @param UpdateADSCampaignBudgetCommand $command
     * @return ADSCampaign
     * @throws BusinessRuleException
     */
    public function execute(UpdateADSCampaignBudgetCommand $command): ADSCampaign
    {
        $campaign = $this->campaignService->getCampaignById($command->campaignId);
        
        if (!$campaign) {
            throw new BusinessRuleException('Campaign not found');
        }

        // Validate budget update
        $this->validateBudgetUpdate($campaign, $command->newBudget);

        // Update the campaign budget
        $campaign->updateBudget($command->newBudget);
        
        // Save the campaign
        $updatedCampaign = $this->campaignService->updateCampaign($command->campaignId, [
            'daily_budget' => $campaign->dailyBudget,
            'updated_at' => $campaign->updatedAt
        ]);

        return $updatedCampaign;
    }

    /**
     * Valida se o orçamento pode ser atualizado.
     *
     * @param ADSCampaign $campaign
     * @param float $newBudget
     * @throws BusinessRuleException
     */
    private function validateBudgetUpdate(ADSCampaign $campaign, float $newBudget): void
    {
        // Check if campaign is ended
        if ($campaign->isEnded()) {
            throw new BusinessRuleException('Cannot update budget of an ended campaign');
        }

        // Check if new budget is valid
        if ($newBudget <= 0) {
            throw new BusinessRuleException('Budget must be greater than 0');
        }

        if ($newBudget > 10000) {
            throw new BusinessRuleException('Budget cannot exceed $10,000 per day');
        }

        // Check if budget change is within reasonable limits
        $currentBudget = $campaign->dailyBudget;
        $changePercentage = abs($newBudget - $currentBudget) / $currentBudget * 100;
        
        if ($changePercentage > 50) {
            throw new BusinessRuleException('Budget change cannot exceed 50% of current budget');
        }
    }
}