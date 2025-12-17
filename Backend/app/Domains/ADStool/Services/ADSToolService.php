<?php

namespace App\Domains\ADStool\Services;

use App\Domains\ADStool\DTOs\CreateADSCampaignDTO;
use App\Domains\ADStool\Sagas\CreateADSCampaignSaga;

/**
 * Serviço de fachada para o domínio ADStool.
 *
 * Este serviço atua como um ponto de entrada principal para as funcionalidades do módulo,
 * orquestrando a lógica de negócio e delegando tarefas para serviços mais específicos
 * ou para Sagas, quando múltiplos passos estão envolvidos.
 */
class ADSToolService
{
    /**
     * @var CreateADSCampaignSaga
     */
    protected CreateADSCampaignSaga $createCampaignSaga;

    /**
     * @var CampaignService
     */
    protected CampaignService $campaignService;

    /**
     * @var AccountService
     */
    protected AccountService $accountService;

    /**
     * @param CreateADSCampaignSaga $createCampaignSaga
     * @param CampaignService       $campaignService
     * @param AccountService        $accountService
     */
    public function __construct(
        CreateADSCampaignSaga $createCampaignSaga,
        CampaignService $campaignService,
        AccountService $accountService,
    ) {
        $this->createCampaignSaga = $createCampaignSaga;
        $this->campaignService = $campaignService;
        $this->accountService = $accountService;
    }

    /**
     * Orquestra a criação de uma nova campanha de anúncios.
     *
     * @param CreateADSCampaignDTO $dto
     *
     * @return \App\Domains\ADStool\Models\ADSCampaign
     *
     * @throws \Exception
     */
    public function createNewCampaign(CreateADSCampaignDTO $dto)
    {
        // Delega a lógica complexa de criação para a Saga
        return $this->createCampaignSaga->handle($dto);
    }

    /**
     * Obtém o dashboard de dados para um usuário.
     *
     * @param int $userId
     *
     * @return \App\Domains\ADStool\DTOs\DashboardDataDTO
     */
    public function getDashboardData(int $userId)
    {
        // Delega para os serviços específicos e agrega os resultados
        $summary = $this->campaignService->getAnalyticsSummaryForUser($userId);
        $recentCampaigns = $this->campaignService->getRecentCampaignsForUser($userId, 5);
        $alerts = []; // Lógica para buscar alertas aqui

        return new \App\Domains\ADStool\DTOs\DashboardDataDTO($summary, $recentCampaigns, $alerts);
    }
}
