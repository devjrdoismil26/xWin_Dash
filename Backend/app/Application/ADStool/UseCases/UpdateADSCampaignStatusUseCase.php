<?php

namespace App\Application\ADStool\UseCases;

use App\Application\ADStool\Commands\UpdateADSCampaignStatusCommand;
use App\Domains\ADStool\DTOs\UpdateCampaignDTO; // Supondo que este serviço exista
use App\Domains\ADStool\Services\CampaignService; // Reutilizando o DTO

class UpdateADSCampaignStatusUseCase
{
    protected CampaignService $campaignService;

    public function __construct(CampaignService $campaignService)
    {
        $this->campaignService = $campaignService;
    }

    /**
     * Executa o caso de uso para atualizar o status de uma campanha de anúncios.
     *
     * @param UpdateADSCampaignStatusCommand $command
     *
     * @return mixed a campanha atualizada
     */
    public function execute(UpdateADSCampaignStatusCommand $command)
    {
        // Cria um DTO de atualização com o novo status
        $updateDto = new UpdateCampaignDTO(null, $command->newStatus, null, null);

        return $this->campaignService->updateCampaign($command->campaignId, $updateDto);
    }
}
