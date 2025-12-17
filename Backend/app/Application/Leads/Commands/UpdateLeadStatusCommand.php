<?php

namespace App\Application\Leads\Commands;

class UpdateLeadStatusCommand
{
    public int $leadId;

    public string $newStatus;

    public function __construct(int $leadId, string $newStatus)
    {
        $this->leadId = $leadId;
        $this->newStatus = $newStatus;
    }
}
