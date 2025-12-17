<?php

namespace App\Domains\EmailMarketing\Jobs;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use App\Domains\EmailMarketing\Services\EmailCampaignService;
use App\Domains\EmailMarketing\Services\EmailSubscriberService;
use App\Domains\EmailMarketing\Services\EmailProviderManager;
use App\Domains\EmailMarketing\Notifications\CampaignCompletedNotification;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessEmailCampaign implements ShouldQueue
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
     * @param EmailCampaignService   $emailCampaignService
     * @param EmailSubscriberService $emailSubscriberService
     */
    public function handle(EmailCampaignService $emailCampaignService, EmailSubscriberService $emailSubscriberService)
    {
        Log::info("Processando campanha de e-mail: {$this->campaign->name} (ID: {$this->campaign->id})");

        // Atualizar status da campanha para 'sending'
        $emailCampaignService->updateCampaignStatus($this->campaign->id, 'sending');

        // Obter assinantes da lista associada à campanha
        $subscribers = $emailSubscriberService->getSubscribersByListId($this->campaign->emailListId);

        foreach ($subscribers as $subscriber) {
            // Disparar um job para enviar cada e-mail individualmente
            SendEmailJob::dispatch($this->campaign, $subscriber);
        }

        // Atualizar status da campanha para 'completed' após o processamento
        $emailCampaignService->updateCampaignStatus($this->campaign->id, 'completed');

        // Enviar notificação de campanha concluída
        $user = User::find($this->campaign->userId);
        if ($user) {
            $stats = [
                'sent' => count($subscribers), // Simplificado - em produção seria calculado dos logs
                'failed' => 0,
            ];
            $user->notify(new CampaignCompletedNotification($this->campaign, $stats));
        }

        Log::info("Campanha de e-mail {$this->campaign->name} (ID: {$this->campaign->id}) processada.");
    }
}
