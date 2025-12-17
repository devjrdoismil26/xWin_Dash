<?php

namespace App\Application\ADStool\Commands;

class UpdateADSCampaignStatusCommand
{
    public int $campaignId;

    public string $newStatus;

    public function __construct(int $campaignId, string $newStatus)
    {
        $this->campaignId = $campaignId;
        $this->newStatus = $newStatus;
    }
}
