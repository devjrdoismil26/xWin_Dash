<?php

namespace App\Application\EmailMarketing\UseCases;

use App\Application\EmailMarketing\Commands\CreateEmailCampaignCommand;
use App\Domains\EmailMarketing\Services\EmailCampaignService; // Supondo que este serviço exista

class CreateEmailCampaignUseCase
{
    protected EmailCampaignService $emailCampaignService;

    public function __construct(EmailCampaignService $emailCampaignService)
    {
        $this->emailCampaignService = $emailCampaignService;
    }

    /**
     * Executa o caso de uso para criar uma nova campanha de e-mail.
     *
     * @param CreateEmailCampaignCommand $command
     *
     * @return mixed a campanha de e-mail criada
     */
    public function execute(CreateEmailCampaignCommand $command)
    {
        return $this->emailCampaignService->createCampaign(
            $command->name,
            $command->subject,
            $command->content,
            $command->emailListId,
            $command->userId,
        );
    }
}
