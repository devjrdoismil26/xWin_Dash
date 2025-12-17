<?php

namespace App\Application\ADStool\Commands;

class UpdateADSCampaignBudgetCommand
{
    public int $campaignId;
    public float $newBudget;

    public function __construct(int $campaignId, float $newBudget)
    {
        $this->campaignId = $campaignId;
        $this->newBudget = $newBudget;
    }
}