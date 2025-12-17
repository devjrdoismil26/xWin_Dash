<?php

namespace App\Application\EmailMarketing\Commands;

class UpdateEmailCampaignStatusCommand
{
    public int $campaignId;

    public string $newStatus;

    public function __construct(int $campaignId, string $newStatus)
    {
        $this->campaignId = $campaignId;
        $this->newStatus = $newStatus;
    }
}
