<?php

namespace App\Application\ADStool\Commands;

class SyncADSCampaignCommand
{
    public int $campaignId;

    public function __construct(int $campaignId)
    {
        $this->campaignId = $campaignId;
    }
}