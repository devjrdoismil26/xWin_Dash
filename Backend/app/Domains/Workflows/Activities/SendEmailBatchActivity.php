<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\EmailMarketing\Jobs\SendEmailJob;
use App\Domains\EmailMarketing\Models\EmailCampaign;
use App\Domains\EmailMarketing\Models\EmailSubscriber;
use App\Domains\Leads\Models\Lead;
use Illuminate\Support\Facades\Log as LoggerFacade;
use Workflow\Activity;

class SendEmailBatchActivity extends Activity
{
    /**
     * Envia um lote de e-mails para os assinantes de uma campanha.
     *
     * @param array<string, mixed> $data deve conter 'batch' (array de IDs de EmailSubscriber) e 'campaign_id'
     */
    public function execute(array $data): void
    {
        $batchSubscriberIds = $data['batch'];
        $campaignId = $data['campaign_id'];

        $campaign = EmailCampaign::find($campaignId);

        if (!$campaign) {
            LoggerFacade::error("SendEmailBatchActivity: Campanha de e-mail com ID {$campaignId} não encontrada.");
            return;
        }

        $subscribers = EmailSubscriber::whereIn('id', $batchSubscriberIds)->get();

        foreach ($subscribers as $subscriber) {            // Se o subscriber for um Lead, pode ser passado diretamente.
            // Caso contrário, você precisará carregar o Lead correspondente ao subscriber.
            $lead = Lead::where('email', $subscriber->email)->first(); // Tentativa de encontrar o Lead pelo e-mail

            if ($lead) {
                // Dispara o job para enviar o e-mail individualmente
                SendEmailJob::dispatch($campaign, $lead);
            } else {
                LoggerFacade::warning("SendEmailBatchActivity: Lead não encontrado para o assinante {$subscriber->email}.");
            }
        }
    }
}
