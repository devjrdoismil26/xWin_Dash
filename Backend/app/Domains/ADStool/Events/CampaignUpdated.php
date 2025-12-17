<?php

namespace App\Domains\ADStool\Events;

use App\Domains\ADStool\Models\Campaign;

class CampaignUpdated
{
    public Campaign $campaign;

    /** @var array<string, mixed> */
    public array $updatedData;

    /**
     * @param array<string, mixed> $updatedData
     */
    public function __construct(Campaign $campaign, array $updatedData)
    {
        $this->campaign = $campaign;
        $this->updatedData = $updatedData;
    }
}
