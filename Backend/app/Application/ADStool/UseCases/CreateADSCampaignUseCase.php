<?php

namespace App\Application\ADStool\UseCases;

use App\Application\ADStool\Commands\CreateADSCampaignCommand;
use App\Domains\ADStool\DTOs\CreateADSCampaignDTO; // Nosso serviço de fachada
use App\Domains\ADStool\Services\ADSToolService; // Nosso DTO de criação

class CreateADSCampaignUseCase
{
    protected ADSToolService $adsToolService;

    public function __construct(ADSToolService $adsToolService)
    {
        $this->adsToolService = $adsToolService;
    }

    /**
     * Executa o caso de uso para criar uma nova campanha de anúncios.
     *
     * @param CreateADSCampaignCommand $command
     *
     * @return mixed a campanha de anúncios criada
     */
    public function execute(CreateADSCampaignCommand $command)
    {
        // Converte o Command para o DTO que o serviço de domínio espera
        $createDto = new CreateADSCampaignDTO(
            $command->name,
            $command->objective,
            $command->platform,
            $command->dailyBudget,
            $command->userId,
        );

        return $this->adsToolService->createNewCampaign($createDto);
    }
}
