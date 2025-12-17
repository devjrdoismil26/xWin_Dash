<?php

namespace App\Application\Workflows\Listeners;

use App\Domains\Workflows\Events\WorkflowCompleted; // Supondo que este evento exista
use App\Domains\Workflows\Events\WorkflowFailed; // Supondo que este evento exista
use App\Domains\Workflows\Events\WorkflowStarted; // Supondo que este evento exista
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class ProcessWorkflowListener implements ShouldQueue
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
     * Handle the WorkflowStarted event.
     *
     * @param WorkflowStarted $event
     */
    public function handleWorkflowStarted(WorkflowStarted $event): void
    {
        Log::info("ProcessWorkflowListener: Workflow execution (ID: {$event->execution->id}) iniciado.");
        // Lógica para registrar o início da execução, atualizar status, etc.
    }

    /**
     * Handle the WorkflowCompleted event.
     *
     * @param WorkflowCompleted $event
     */
    public function handleWorkflowCompleted(WorkflowCompleted $event): void
    {
        Log::info("ProcessWorkflowListener: Workflow execution (ID: {$event->execution->id}) concluído com sucesso.");
        // Lógica para registrar a conclusão, notificar o usuário, etc.
    }

    /**
     * Handle the WorkflowFailed event.
     *
     * @param WorkflowFailed $event
     */
    public function handleWorkflowFailed(WorkflowFailed $event): void
    {
        Log::error("ProcessWorkflowListener: Workflow execution (ID: {$event->execution->id}) falhou. Erro: {$event->errorMessage}");
        // Lógica para registrar a falha, notificar administradores, etc.
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @param \Illuminate\Events\Dispatcher $events
     *
     * @return array<string, string>
     */
    public function subscribe($events): array
    {
        $events->listen(
            WorkflowStarted::class,
            [ProcessWorkflowListener::class, 'handleWorkflowStarted'],
        );

        $events->listen(
            WorkflowCompleted::class,
            [ProcessWorkflowListener::class, 'handleWorkflowCompleted'],
        );

        $events->listen(
            WorkflowFailed::class,
            [ProcessWorkflowListener::class, 'handleWorkflowFailed'],
        );

        return [
            WorkflowStarted::class => 'handleWorkflowStarted',
            WorkflowCompleted::class => 'handleWorkflowCompleted',
            WorkflowFailed::class => 'handleWorkflowFailed',
        ];
    }
}
