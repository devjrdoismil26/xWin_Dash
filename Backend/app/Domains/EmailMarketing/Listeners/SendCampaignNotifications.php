<?php

namespace App\Domains\EmailMarketing\Listeners;

use App\Domains\Core\Services\NotificationService;
use App\Domains\EmailMarketing\Events\EmailCampaignStatusChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

// Supondo que este serviço exista

class SendCampaignNotifications implements ShouldQueue
{
    use InteractsWithQueue;

    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     *
     * @param EmailCampaignStatusChanged $event
     */
    public function handle(EmailCampaignStatusChanged $event)
    {
        $campaign = $event->campaign;
        $newStatus = $event->newStatus;

        Log::info("Notificação de campanha: Status da campanha '{$campaign->name}' (ID: {$campaign->id}) alterado para '{$newStatus}'.");

        // Exemplo de envio de notificação ao usuário criador da campanha
        $this->notificationService->createNotification(
            $campaign->userId, // Assumindo que a campanha tem um user_id
            "O status da sua campanha de e-mail '{$campaign->name}' foi alterado para '{$newStatus}'.",
            'info',
            "/email-marketing/campaigns/{$campaign->id}", // Link para a campanha
        );

        // Lógica adicional para diferentes status, como notificar administradores em caso de falha
        if ($newStatus === 'failed') {
            // Enviar notificação para administradores
            // $this->notificationService->createNotification(
            //     'admin_user_id',
            //     "A campanha '{$campaign->name}' falhou.",
            //     'error'
            // );
        }
    }
}
