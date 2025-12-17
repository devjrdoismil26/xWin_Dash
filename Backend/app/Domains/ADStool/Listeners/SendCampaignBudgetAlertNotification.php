<?php

namespace App\Domains\ADStool\Listeners;

use App\Domains\ADStool\Events\CampaignBudgetAlert;
use App\Mail\CampaignBudgetAlertMail;
use App\Domains\Users\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

/**
 * Listener responsável por enviar uma notificação quando um alerta de orçamento de campanha é disparado.
 */
class SendCampaignBudgetAlertNotification implements ShouldQueue
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
     * Handle the event.
     *
     * @param CampaignBudgetAlert $event
     * @return void
     */
    public function handle(CampaignBudgetAlert $event): void
    {
        Log::info('Enviando notificação de alerta de orçamento para a campanha ID: ' . $event->alertInfo->campaignId);

        // Encontrar o usuário dono da campanha para notificá-lo
        // Esta lógica pode variar dependendo da estrutura do seu banco de dados
        // $campaign = \App\Domains\ADStool\Models\ADSCampaign::find($event->alertInfo->campaignId);
        // $user = $campaign->user;

        // Exemplo de busca de um usuário administrador para notificação
        $adminUser = User::where('is_admin', true)->first();

        if ($adminUser) {
            try {
                // Usando o sistema de Mail do Laravel para enviar a notificação
                // Mail::to($adminUser->email)->send(new CampaignBudgetAlertMail($event->alertInfo));
                Log::info("Notificação por e-mail para {$adminUser->email} sobre o alerta '{$event->alertInfo->message}' seria enviada aqui.");
            } catch (\Exception $e) {
                Log::error('Falha ao enviar e-mail de alerta de orçamento: ' . $e->getMessage());
            }
        }
    }
}
