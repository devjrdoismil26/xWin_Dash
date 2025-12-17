<?php

namespace App\Domains\ADStool\Listeners;

use App\Domains\ADStool\Events\CampaignPerformanceUpdated;
use App\Mail\CampaignPerformanceReportMail;
use App\Domains\Users\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

/**
 * Listener responsável por enviar uma notificação de resumo após a atualização do desempenho de uma campanha.
 */
class SendCampaignPerformanceUpdatedNotification implements ShouldQueue
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
     * @param CampaignPerformanceUpdated $event
     * @return void
     */
    public function handle(CampaignPerformanceUpdated $event): void
    {
        Log::info('Enviando notificação de atualização de desempenho para a campanha ID: ' . $event->performanceData->campaignId);

        // Lógica para decidir se uma notificação deve ser enviada.
        // Talvez apenas uma vez por dia, ou se houver mudanças significativas.
        // $shouldNotify = $event->performanceData->campaignId !== null; // Lógica de decisão aqui

        // if ($shouldNotify) {
        if ($event->performanceData->campaignId) {
            // $campaign = \App\Domains\ADStool\Models\ADSCampaign::find($event->performanceData->campaignId);
            // $user = $campaign->user;
            $adminUser = User::where('is_admin', true)->first();

            if ($adminUser) {
                try {
                    // Mail::to($adminUser->email)->send(new CampaignPerformanceReportMail($event->performanceData));
                    Log::info("Notificação de relatório de desempenho para {$adminUser->email} seria enviada aqui.");
                } catch (\Exception $e) {
                    Log::error('Falha ao enviar e-mail de relatório de desempenho: ' . $e->getMessage());
                }
            }
        }
    }
}
