<?php

namespace App\Domains\ADStool\Sagas;

use App\Domains\ADStool\Contracts\ADSCampaignRepositoryInterface;
use App\Domains\ADStool\DTOs\CreateADSCampaignDTO;
use App\Domains\ADStool\Services\AdPlatformIntegrationService;
use App\Domains\ADStool\Services\CampaignService;
use Exception;

/**
 * A Saga é um padrão de design para gerenciar falhas em transações distribuídas ou de longa duração.
 * Ela orquestra uma sequência de transações locais. Se uma transação falhar, a Saga executa
 * transações de compensação para reverter o impacto das transações anteriores.
 */
class CreateADSCampaignSaga
{
    protected CampaignService $campaignService;
    protected AdPlatformIntegrationService $adPlatformIntegrationService;
    protected ADSCampaignRepositoryInterface $campaignRepository;

    /**
     * Construtor da Saga de Criação de Campanha.
     */
    public function __construct(
        CampaignService $campaignService,
        AdPlatformIntegrationService $adPlatformIntegrationService,
        ADSCampaignRepositoryInterface $campaignRepository
    ) {
        $this->campaignService = $campaignService;
        $this->adPlatformIntegrationService = $adPlatformIntegrationService;
        $this->campaignRepository = $campaignRepository;
    }

    /**
     * Executa a Saga para criar uma nova campanha de anúncios.
     *
     * @param CreateADSCampaignDTO $dto os dados para a criação da campanha
     *
     * @return mixed o resultado da criação da campanha
     *
     * @throws Exception em caso de falha em qualquer etapa crítica
     */
    public function handle(CreateADSCampaignDTO $dto)
    {
        // Etapa 1: Validação dos dados (pode ser expandida conforme necessário)
        // A validação principal já deve ter sido feita pelo FormRequest,
        // mas a Saga pode conter regras de negócio mais complexas.

        // Etapa 2: Criar a campanha no banco de dados local.
        $localCampaign = $this->campaignRepository->createFromDTO($dto);

        try {
            // Etapa 3: Tentar criar a campanha na plataforma de anúncios externa.
            // Converter para CampaignCreationDTO se necessário
            $campaignCreationDto = new \App\Domains\ADStool\DTOs\CampaignCreationDTO(
                $dto->name,
                $dto->objective,
                $dto->platform,
                $dto->budget,
                $dto->userId ?? 1,
                []
            );
            $platformResult = $this->adPlatformIntegrationService->createCampaign($campaignCreationDto);

            // Etapa 4: Atualizar a campanha local com informações da plataforma (ex: ID externo).
            $this->campaignService->updateCampaignWithPlatformData($localCampaign->id, $platformResult->toArray());

            return $localCampaign->fresh();
        } catch (Exception $e) {
            // Etapa de Compensação: Se a criação na plataforma externa falhar,
            // podemos marcar a campanha local como 'falha' ou excluí-la.
            $this->campaignService->markCampaignAsFailed($localCampaign->id, $e->getMessage());

            // Propaga a exceção para que o chamador saiba que o processo falhou.
            throw $e;
        }
    }
}
