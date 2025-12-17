<?php

namespace App\Domains\ADStool\Application\Handlers;

use App\Domains\ADStool\Application\Commands\CreateADSCampaignCommand;
use App\Domains\ADStool\Domain\ADSCampaign;
use App\Domains\ADStool\Infrastructure\Repositories\ADSCampaignRepository;
use App\Domains\ADStool\Infrastructure\Repositories\AccountRepository;
use App\Domains\ADStool\Infrastructure\Repositories\CreativeRepository;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Handler para comando de criação de campanha ADS
 *
 * Processa o comando de criação e persiste a campanha
 * no repositório.
 */
class CreateADSCampaignHandler
{
    private ADSCampaignRepository $campaignRepository;
    private AccountRepository $accountRepository;
    private CreativeRepository $creativeRepository;

    public function __construct(
        ADSCampaignRepository $campaignRepository,
        AccountRepository $accountRepository,
        CreativeRepository $creativeRepository
    ) {
        $this->campaignRepository = $campaignRepository;
        $this->accountRepository = $accountRepository;
        $this->creativeRepository = $creativeRepository;
    }

    /**
     * Processa o comando de criação de campanha
     */
    public function handle(CreateADSCampaignCommand $command): ADSCampaign
    {
        try {
            Log::info('Processing CreateADSCampaignCommand', [
                'user_id' => $command->getUserId(),
                'campaign_name' => $command->getName(),
                'campaign_type' => $command->getType()
            ]);

            // Criar entidade de domínio
            $campaign = new ADSCampaign(
                name: $command->getName(),
                userId: $command->getUserId(),
                description: $command->getDescription(),
                status: $command->getStatus(),
                type: $command->getType(),
                budget: $command->getBudget(),
                targetAudience: $command->getTargetAudience(),
                keywords: $command->getKeywords(),
                adGroups: $command->getAdGroups(),
                creatives: $command->getCreatives(),
                settings: $command->getSettings(),
                startDate: $command->getStartDate(),
                endDate: $command->getEndDate(),
                metadata: $command->getMetadata()
            );

            // Validar se o usuário tem conta ADS ativa
            $this->validateUserAccount($command->getUserId());

            // Persistir campanha
            $savedCampaign = $this->campaignRepository->save($campaign);

            // Criar grupos de anúncios se fornecidos
            if (!empty($command->getAdGroups())) {
                $this->createAdGroups($savedCampaign, $command->getAdGroups());
            }

            // Criar criativos se fornecidos
            if (!empty($command->getCreatives())) {
                $this->createCreatives($savedCampaign, $command->getCreatives());
            }

            // Configurar campanha no provedor de anúncios
            $this->setupCampaignInAdProvider($savedCampaign);

            Log::info('ADS campaign created successfully', [
                'campaign_id' => $savedCampaign->getId(),
                'user_id' => $command->getUserId()
            ]);

            return $savedCampaign;
        } catch (\Throwable $exception) {
            Log::error('Error processing CreateADSCampaignCommand', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'campaign_name' => $command->getName()
            ]);

            throw $exception;
        }
    }

    /**
     * Valida se o usuário tem conta ADS ativa
     */
    private function validateUserAccount(int $userId): void
    {
        $account = $this->accountRepository->findByUserId($userId);

        if (!$account) {
            throw new \Exception('Usuário não possui conta ADS configurada');
        }

        if (!$account->isActive()) {
            throw new \Exception('Conta ADS do usuário não está ativa');
        }

        if (!$account->hasValidCredentials()) {
            throw new \Exception('Credenciais da conta ADS são inválidas');
        }
    }

    /**
     * Cria grupos de anúncios
     */
    private function createAdGroups(ADSCampaign $campaign, array $adGroups): void
    {
        try {
            foreach ($adGroups as $adGroupData) {
                $adGroup = new \App\Domains\ADStool\Domain\AdGroup(
                    name: $adGroupData['name'],
                    campaignId: $campaign->getId(),
                    userId: $campaign->getUserId(),
                    description: $adGroupData['description'] ?? null,
                    status: $adGroupData['status'] ?? 'active',
                    bidAmount: $adGroupData['bid_amount'] ?? 0.0,
                    keywords: $adGroupData['keywords'] ?? [],
                    settings: $adGroupData['settings'] ?? []
                );

                $this->campaignRepository->saveAdGroup($adGroup);
            }

            Log::info('Ad groups created for campaign', [
                'campaign_id' => $campaign->getId(),
                'ad_groups_count' => count($adGroups)
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error creating ad groups', [
                'error' => $exception->getMessage(),
                'campaign_id' => $campaign->getId()
            ]);

            throw $exception;
        }
    }

    /**
     * Cria criativos
     */
    private function createCreatives(ADSCampaign $campaign, array $creatives): void
    {
        try {
            foreach ($creatives as $creativeData) {
                $creative = new \App\Domains\ADStool\Domain\Creative(
                    name: $creativeData['name'],
                    campaignId: $campaign->getId(),
                    userId: $campaign->getUserId(),
                    type: $creativeData['type'],
                    content: $creativeData['content'],
                    status: $creativeData['status'] ?? 'active',
                    settings: $creativeData['settings'] ?? []
                );

                $this->creativeRepository->save($creative);
            }

            Log::info('Creatives created for campaign', [
                'campaign_id' => $campaign->getId(),
                'creatives_count' => count($creatives)
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error creating creatives', [
                'error' => $exception->getMessage(),
                'campaign_id' => $campaign->getId()
            ]);

            throw $exception;
        }
    }

    /**
     * Configura campanha no provedor de anúncios
     */
    private function setupCampaignInAdProvider(ADSCampaign $campaign): void
    {
        try {
            // Obter conta do usuário
            $account = $this->accountRepository->findByUserId($campaign->getUserId());

            if (!$account) {
                throw new \Exception('Conta ADS não encontrada');
            }

            // Configurar campanha no provedor (Google Ads, Facebook Ads, etc.)
            $provider = $this->getAdProvider($account->getProvider());

            $provider->createCampaign([
                'name' => $campaign->getName(),
                'type' => $campaign->getType(),
                'budget' => $campaign->getBudget(),
                'target_audience' => $campaign->getTargetAudience(),
                'settings' => $campaign->getSettings(),
                'start_date' => $campaign->getStartDate(),
                'end_date' => $campaign->getEndDate()
            ]);

            Log::info('Campaign configured in ad provider', [
                'campaign_id' => $campaign->getId(),
                'provider' => $account->getProvider()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error setting up campaign in ad provider', [
                'error' => $exception->getMessage(),
                'campaign_id' => $campaign->getId()
            ]);

            // Não falhar a criação da campanha se houver erro no provedor
            // A campanha pode ser configurada posteriormente
        }
    }

    /**
     * Obtém provedor de anúncios
     */
    private function getAdProvider(string $provider): object
    {
        switch ($provider) {
            case 'google_ads':
                return app(\App\Domains\ADStool\Services\ExternalApi\GoogleAdsService::class);
            case 'facebook_ads':
                return app(\App\Domains\ADStool\Services\ExternalApi\FacebookAdsService::class);
            default:
                throw new \Exception("Provedor de anúncios '{$provider}' não suportado");
        }
    }

    /**
     * Obtém estatísticas do handler
     */
    public function getStats(): array
    {
        return [
            'handler' => 'CreateADSCampaignHandler',
            'description' => 'Handler para criação de campanhas ADS',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
