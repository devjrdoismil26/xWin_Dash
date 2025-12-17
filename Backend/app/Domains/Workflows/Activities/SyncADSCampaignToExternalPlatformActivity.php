<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\ADStool\Models\ADSCampaign;
use App\Domains\ADStool\Services\AdPlatformService;
use App\Domains\Integrations\Services\CredentialService;
use App\Domains\Users\Models\User; // Adicionado
use Illuminate\Support\Facades\Log; // Importar o modelo User
use Workflow\Activity;

class SyncADSCampaignToExternalPlatformActivity extends Activity
{
    protected AdPlatformService $adPlatformService;

    protected CredentialService $credentialService; // Adicionado

    public function __construct(AdPlatformService $adPlatformService, CredentialService $credentialService) // Modificado
    {
        $this->adPlatformService = $adPlatformService;
        $this->credentialService = $credentialService; // Adicionado
    }

    /**
     * Sincroniza uma campanha de anúncios com a plataforma externa.
     *
     * @param ADSCampaign $localCampaign a campanha criada localmente
     * @param array       $campaignData  dados adicionais da campanha, incluindo a plataforma
     * @param User        $user          o usuário cujas credenciais serão usadas
     *
     * @return array o resultado da criação na plataforma externa
     *
     * @throws \InvalidArgumentException se a plataforma não for suportada
     */
    public function execute(ADSCampaign $localCampaign, array $campaignData, User $user): array
    {
        $platform = $campaignData['platform'] ?? null;

        if (!$platform) {
            throw new \InvalidArgumentException('Plataforma de anúncios não especificada para sincronização.');
        }

        $credentials = $this->credentialService->getCredential($user->id, $platform);
        $integrationService = $this->adPlatformService->getIntegrationService($platform, $credentials);

        // Chama o método createCampaign na integração específica da plataforma
        $externalResult = $integrationService->createCampaign($campaignData);

        // Atualiza o modelo local com o ID externo e outros dados da plataforma
        $localCampaign->update([
            'external_id' => $externalResult['external_id'] ?? null,
            'status' => $externalResult['status'] ?? $localCampaign->status, // Atualiza status se retornado
        ]);

        return $externalResult;
    }

    /**
     * Compensa a criação da campanha na plataforma externa (se possível).
     *
     * @param ADSCampaign $localCampaign a campanha local
     * @param array       $campaignData  dados da campanha
     * @param User        $user          o usuário cujas credenciais serão usadas
     */
    public function compensate(ADSCampaign $localCampaign, array $campaignData, User $user): void
    {
        // Lógica de compensação: tentar deletar a campanha na plataforma externa.
        // Isso é complexo e pode não ser suportado por todas as APIs.
        // Por simplicidade, vamos apenas logar.
        Log::warning('Compensação para SyncADSCampaignToExternalPlatformActivity não totalmente implementada.', [
            'campaign_id' => $localCampaign->id,
            'external_id' => $localCampaign->external_id,
            'platform' => $campaignData['platform'] ?? 'unknown',
        ]);
    }
}
