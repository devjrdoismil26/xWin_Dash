<?php

namespace App\Application\Projects\Listeners;

use App\Domains\Projects\Events\ProjectCreated; // Supondo que este evento exista
use App\Domains\Projects\Events\ProjectStatusChanged; // Supondo que este evento exista
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class ProcessProjectListener implements ShouldQueue
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
     * Handle the ProjectCreated event.
     *
     * @param ProjectCreated $event
     */
    public function handleProjectCreated(ProjectCreated $event)
    {
        Log::info("ProcessProjectListener: Projeto '{$event->project->name}' (ID: {$event->project->id}) criado.");
        // Lógica para inicializar recursos do projeto, notificar o criador, etc.
    }

    /**
     * Handle the ProjectStatusChanged event.
     *
     * @param ProjectStatusChanged $event
     */
    public function handleProjectStatusChanged(ProjectStatusChanged $event)
    {
        Log::info("ProcessProjectListener: Status do Projeto '{$event->project->name}' (ID: {$event->project->id}) alterado para '{$event->newStatus}'.");
        // Lógica para reagir à mudança de status, como pausar/ativar tarefas, enviar notificações.
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
            ProjectCreated::class,
            [ProcessProjectListener::class, 'handleProjectCreated'],
        );

        $events->listen(
            ProjectStatusChanged::class,
            [ProcessProjectListener::class, 'handleProjectStatusChanged'],
        );
    }
}
