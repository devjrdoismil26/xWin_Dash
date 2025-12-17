<?php

namespace App\Domains\Core\Listeners;

use App\Domains\Core\Services\NotificationService; // Supondo que este evento exista
use App\Domains\Projects\Events\ProjectStatusChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

// Supondo que este serviço exista

class ProjectStatusChangedListener implements ShouldQueue
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
     * @param ProjectStatusChanged $event
     */
    public function handle(ProjectStatusChanged $event)
    {
        Log::info("Status do Projeto {$event->project->name} (ID: {$event->project->id}) alterado para {$event->newStatus}.");

        // Exemplo: Enviar uma notificação ao usuário sobre a mudança de status do projeto
        $this->notificationService->createNotification(
            $event->project->userId, // Assumindo que o projeto tem um userId
            "O status do seu projeto '{$event->project->name}' foi alterado para '{$event->newStatus}'.",
            'info',
            "/projects/{$event->project->id}", // Link para o projeto
        );
    }
}
