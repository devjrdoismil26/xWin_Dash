<?php

namespace App\Domains\ADStool\Contracts;

use App\Domains\ADStool\DTOs\CampaignBudgetUpdateDTO;
use App\Domains\ADStool\DTOs\CampaignCreationDTO;
use App\Domains\ADStool\DTOs\CampaignSettingsUpdateDTO;
use App\Domains\ADStool\DTOs\PlatformCampaignResultDTO;
use App\Domains\ADStool\Models\ADSCampaign;

interface AdPlatformIntegrationInterface
{
    public function createCampaign(CampaignCreationDTO $campaignData): PlatformCampaignResultDTO;

    public function pauseCampaign(ADSCampaign $ADSCampaign): void;

    public function resumeCampaign(ADSCampaign $ADSCampaign): void;

    public function updateBudget(ADSCampaign $ADSCampaign, CampaignBudgetUpdateDTO $budgetData): void;

    public function updateSettings(ADSCampaign $ADSCampaign, CampaignSettingsUpdateDTO $settingsData): void;

    /**
     * @return array<string, mixed>|null
     */
    public function fetchData(ADSCampaign $ADSCampaign): ?array;
}
