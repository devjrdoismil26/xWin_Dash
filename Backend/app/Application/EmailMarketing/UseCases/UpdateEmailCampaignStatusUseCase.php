<?php

namespace App\Application\EmailMarketing\UseCases;

use App\Application\EmailMarketing\Commands\UpdateEmailCampaignStatusCommand;
use App\Domains\EmailMarketing\Services\EmailCampaignService; // Supondo que este serviço exista

class UpdateEmailCampaignStatusUseCase
{
    protected EmailCampaignService $emailCampaignService;

    public function __construct(EmailCampaignService $emailCampaignService)
    {
        $this->emailCampaignService = $emailCampaignService;
    }

    /**
     * Executa o caso de uso para atualizar o status de uma campanha de e-mail.
     *
     * @param UpdateEmailCampaignStatusCommand $command
     *
     * @return mixed a campanha de e-mail atualizada
     */
    public function execute(UpdateEmailCampaignStatusCommand $command)
    {
        return $this->emailCampaignService->updateCampaignStatus($command->campaignId, $command->newStatus);
    }
}
