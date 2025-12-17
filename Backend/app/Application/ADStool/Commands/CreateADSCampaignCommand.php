<?php

namespace App\Application\ADStool\Commands;

class CreateADSCampaignCommand
{
    public string $name;

    public string $objective;

    public string $platform;

    public float $dailyBudget;

    public int $userId;

    public function __construct(string $name, string $objective, string $platform, float $dailyBudget, int $userId)
    {
        $this->name = $name;
        $this->objective = $objective;
        $this->platform = $platform;
        $this->dailyBudget = $dailyBudget;
        $this->userId = $userId;
    }
}
