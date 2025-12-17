<?php

namespace App\Domains\Workflows\Workflows;

use App\Domains\Workflows\Activities\CreateLocalADSCampaignActivity;
use App\Domains\Workflows\Activities\SyncADSCampaignToExternalPlatformActivity;
use Workflow\ActivityStub;
use Workflow\Workflow;

class CreateADSCampaignWorkflow extends Workflow
{
    /**
     * Orquestra a criação de uma campanha de anúncios, localmente e em plataforma externa.
     *
     * @param array $campaignData dados da campanha a ser criada
     *
     * @return \Generator<mixed, mixed, mixed, array> o resultado da criação da campanha
     */
    public function definition(array $campaignData): \Generator
    {
        // 1. Criar a campanha localmente no sistema
        $localCampaign = yield ActivityStub::make(CreateLocalADSCampaignActivity::class, $campaignData);

        // 2. Sincronizar a campanha com a plataforma de anúncios externa
        $externalCampaignResult = yield ActivityStub::make(SyncADSCampaignToExternalPlatformActivity::class, $localCampaign, $campaignData);

        return [
            'local_campaign' => $localCampaign,
            'external_campaign_result' => $externalCampaignResult,
        ];
    }
}
