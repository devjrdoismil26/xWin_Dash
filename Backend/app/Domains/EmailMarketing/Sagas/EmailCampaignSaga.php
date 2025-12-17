<?php

namespace App\Domains\EmailMarketing\Sagas;

use App\Domains\EmailMarketing\Domain\EmailCampaign; // Supondo que a entidade de domínio exista
use App\Domains\EmailMarketing\Jobs\SendCampaignJob; // Supondo que este serviço exista
use App\Domains\EmailMarketing\Services\EmailCampaignService; // Supondo que este job exista
use Illuminate\Support\Facades\Log;

class EmailCampaignSaga
{
    protected EmailCampaignService $emailCampaignService;

    public function __construct(EmailCampaignService $emailCampaignService)
    {
        $this->emailCampaignService = $emailCampaignService;
    }

    /**
     * Inicia a saga de criação e agendamento de uma campanha de e-mail.
     *
     * @param array<string, mixed> $campaignData dados da campanha
     *
     * @return EmailCampaign
     */
    public function createAndScheduleCampaign(array $campaignData): EmailCampaign
    {
        Log::info("Iniciando saga para criar e agendar campanha.", $campaignData);

        try {
            // Passo 1: Criar a campanha no banco de dados
            $campaign = $this->emailCampaignService->createCampaign(
                $campaignData['user_id'],
                $campaignData,
            );

            // Passo 2: Agendar o job de envio da campanha
            if (isset($campaignData['scheduled_at']) && $campaignData['scheduled_at']) {
                SendCampaignJob::dispatch($campaign)->delay(now()->parse($campaignData['scheduled_at']));
                $this->emailCampaignService->updateCampaignStatus($campaign->id ?? 0, 'scheduled');
                Log::info("Campanha ID {$campaign->id} agendada para envio.");
            } else {
                // Se não for agendada, pode ser enviada imediatamente ou ficar como rascunho
                $this->emailCampaignService->updateCampaignStatus($campaign->id ?? 0, 'draft');
                Log::info("Campanha ID {$campaign->id} criada como rascunho.");
            }

            Log::info("Saga de campanha concluída com sucesso para ID: {$campaign->id}.");
            return $campaign;
        } catch (\Exception $e) {
            Log::error("Saga de campanha falhou. Erro: " . $e->getMessage());
            // Compensating transaction: reverter a criação da campanha se algo falhar
            if (isset($campaign)) {
                $this->emailCampaignService->deleteCampaign($campaign->id);
                Log::info("Campanha ID {$campaign->id} revertida devido a falha na saga.");
            }
            throw $e; // Re-lançar a exceção
        }
    }
}
