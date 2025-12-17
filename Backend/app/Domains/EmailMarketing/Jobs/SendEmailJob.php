<?php

namespace App\Domains\EmailMarketing\Jobs;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use App\Domains\EmailMarketing\Domain\EmailSubscriber;
use App\Domains\EmailMarketing\Mail\CampaignEmail;
use App\Domains\EmailMarketing\Services\EmailCampaignService;
use App\Domains\EmailMarketing\Services\EmailProviderManager;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    protected EmailCampaign $campaign;

    protected EmailSubscriber $subscriber;

    /**
     * Create a new job instance.
     *
     * @param EmailCampaign   $campaign
     * @param EmailSubscriber $subscriber
     */
    public function __construct(EmailCampaign $campaign, EmailSubscriber $subscriber)
    {
        $this->campaign = $campaign;
        $this->subscriber = $subscriber;
    }

    /**
     * Execute the job.
     *
     * @param EmailCampaignService $emailCampaignService
     * @param EmailProviderManager $emailProviderManager
     */
    public function handle(EmailCampaignService $emailCampaignService, EmailProviderManager $emailProviderManager)
    {
        Log::info("Enviando e-mail da campanha {$this->campaign->name} para {$this->subscriber->email}");

        $emailLog = null;

        try {
            // Criar um log de e-mail antes de tentar enviar
            $emailLog = $emailCampaignService->createEmailLog(
                $this->campaign->id,
                $this->subscriber->id,
                'pending',
            );

            // Verificar se existe classe CampaignEmail ou usar envio direto
            if (class_exists(CampaignEmail::class)) {
                Mail::to($this->subscriber->email)->send(new CampaignEmail($this->campaign, $this->subscriber));
            } else {
                // Envio direto usando EmailProviderManager
                $result = $emailProviderManager->sendEmail(
                    $this->subscriber->email,
                    $this->campaign->subject ?? 'Newsletter',
                    $this->campaign->content ?? 'Conteúdo da campanha',
                    [
                        'from' => config('mail.from.address'),
                        'campaign_id' => $this->campaign->id,
                        'subscriber_id' => $this->subscriber->id,
                    ]
                );

                Log::info("Email enviado via provider: " . ($result['provider'] ?? 'unknown'));
            }

            // Atualizar o status do log de e-mail para 'sent'
            $emailCampaignService->updateEmailLogStatus($emailLog->id, 'sent');

            Log::info("E-mail enviado com sucesso para {$this->subscriber->email}.");
        } catch (\Exception $e) {
            // Atualizar o status do log de e-mail para 'failed' com a mensagem de erro
            if ($emailLog) {
                $emailCampaignService->updateEmailLogStatus($emailLog->id, 'failed', $e->getMessage());
            }

            Log::error("Falha ao enviar e-mail para {$this->subscriber->email}: " . $e->getMessage());

            // Re-lançar a exceção para que o job possa ser reprocessado
            throw $e;
        }
    }
}
