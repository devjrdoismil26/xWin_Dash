<?php

namespace App\Domains\EmailMarketing\Jobs;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use App\Domains\EmailMarketing\Services\EmailCampaignService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendCampaignJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    protected EmailCampaign $campaign;

    /**
     * Create a new job instance.
     *
     * @param EmailCampaign $campaign
     */
    public function __construct(EmailCampaign $campaign)
    {
        $this->campaign = $campaign;
    }

    /**
     * Execute the job.
     *
     * @param EmailCampaignService $emailCampaignService
     */
    public function handle(EmailCampaignService $emailCampaignService)
    {
        Log::info("Iniciando SendCampaignJob para campanha: {$this->campaign->name} (ID: {$this->campaign->id})");

        // Atualizar status da campanha para 'sending' ou similar
        $emailCampaignService->updateCampaignStatus($this->campaign->id, 'sending');

        // Disparar o job de processamento da campanha
        ProcessEmailCampaign::dispatch($this->campaign);

        Log::info("SendCampaignJob concluído para campanha: {$this->campaign->name} (ID: {$this->campaign->id}). Processamento iniciado.");
    }
}
