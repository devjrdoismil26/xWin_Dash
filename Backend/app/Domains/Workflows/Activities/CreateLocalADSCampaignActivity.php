<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\ADStool\Models\ADSCampaign;
use App\Domains\ADStool\Services\CampaignService;
use Workflow\Activity;

class CreateLocalADSCampaignActivity extends Activity
{
    protected CampaignService $campaignService;

    public function __construct(CampaignService $campaignService)
    {
        $this->campaignService = $campaignService;
    }

    /**
     * Cria uma campanha de anúncios no sistema local.
     *
     * @param array<string, mixed> $campaignData dados da campanha a ser criada
     *
     * @return ADSCampaign a campanha criada
     */
    public function execute(array $campaignData): ADSCampaign
    {
        // Convert array to DTO if needed by the service
        // For now, assuming the service accepts array directly
        return $this->campaignService->createCampaign($campaignData);
    }

    /**
     * Compensa a criação da campanha local, excluindo-a.
     *
     * @param ADSCampaign $campaign a campanha a ser compensada
     */
    public function compensate(ADSCampaign $campaign): void
    {
        // Pass the campaign ID instead of the model if that's what the service expects
        $this->campaignService->deleteCampaign($campaign->id);
    }
}
