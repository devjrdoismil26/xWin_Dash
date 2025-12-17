<?php

namespace App\Application\EmailMarketing\Listeners;

use App\Domains\EmailMarketing\Events\EmailCampaignCreated; // Supondo que este evento exista
use App\Domains\EmailMarketing\Events\EmailCampaignStatusChanged; // Supondo que este evento exista
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class ProcessEmailCampaignListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the EmailCampaignCreated event.
     *
     * @param EmailCampaignCreated $event
     */
    public function handleEmailCampaignCreated(EmailCampaignCreated $event)
    {
        Log::info("ProcessEmailCampaignListener: Campanha de e-mail '{$event->campaign->name}' (ID: {$event->campaign->id}) criada.");
        // Lógica para inicializar a campanha, agendar o envio, etc.
    }

    /**
     * Handle the EmailCampaignStatusChanged event.
     *
     * @param EmailCampaignStatusChanged $event
     */
    public function handleEmailCampaignStatusChanged(EmailCampaignStatusChanged $event)
    {
        Log::info("ProcessEmailCampaignListener: Status da Campanha de e-mail '{$event->campaign->name}' (ID: {$event->campaign->id}) alterado para '{$event->newStatus}'.");
        // Lógica para reagir à mudança de status, como iniciar/pausar o envio, atualizar métricas.
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @param \Illuminate\Events\Dispatcher $events
     *
     * @return array
     */
    public function subscribe($events)
    {
        $events->listen(
            EmailCampaignCreated::class,
            [ProcessEmailCampaignListener::class, 'handleEmailCampaignCreated'],
        );

        $events->listen(
            EmailCampaignStatusChanged::class,
            [ProcessEmailCampaignListener::class, 'handleEmailCampaignStatusChanged'],
        );
    }
}
