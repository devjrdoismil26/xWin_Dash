<?php

namespace App\Domains\Leads\Listeners;

use App\Domains\Core\Services\NotificationService; // Supondo que este evento exista
use App\Domains\Leads\Events\NewChatStarted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

// Supondo que este serviço exista

class NotifyAgentOfNewChatListener implements ShouldQueue
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
     * @param NewChatStarted $event
     */
    public function handle(NewChatStarted $event)
    {
        $lead = $event->lead;
        $agent = $event->agent; // Supondo que o evento contenha o agente a ser notificado

        Log::info("Notificando agente {$agent->name} sobre novo chat com Lead: {$lead->name} (ID: {$lead->id}).");

        $this->notificationService->createNotification(
            $agent->id,
            "Novo chat iniciado por Lead: {$lead->name} ({$lead->email}).",
            'urgent',
            "/leads/{$lead->id}/chat", // Link para o chat do Lead
        );
    }
}
