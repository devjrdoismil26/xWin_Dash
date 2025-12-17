<?php

namespace App\Domains\Leads\Listeners;

use App\Domains\Leads\Events\LeadCreated;
use App\Domains\Leads\Events\LeadScoreUpdated;
use App\Domains\Leads\Events\LeadStatusChanged;
use App\Domains\Leads\Services\WorkflowService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

// Supondo que este serviço exista

class ProcessLeadWorkflows implements ShouldQueue
{
    use InteractsWithQueue;

    protected WorkflowService $workflowService;

    public function __construct(WorkflowService $workflowService)
    {
        $this->workflowService = $workflowService;
    }

    /**
     * Handle the LeadCreated event.
     *
     * @param LeadCreated $event
     */
    public function handleLeadCreated(LeadCreated $event)
    {
        Log::info("ProcessLeadWorkflows: Lead {$event->lead->id} criado. Iniciando workflows de boas-vindas.");
        $this->workflowService->startWorkflowForLead($event->lead, 'welcome_workflow');
    }

    /**
     * Handle the LeadStatusChanged event.
     *
     * @param LeadStatusChanged $event
     */
    public function handleLeadStatusChanged(LeadStatusChanged $event)
    {
        Log::info("ProcessLeadWorkflows: Status do Lead {$event->lead->id} alterado para {$event->newStatus}. Avaliando workflows.");
        $this->workflowService->evaluateWorkflowsForLead($event->lead, 'status_change', ['new_status' => $event->newStatus]);
    }

    /**
     * Handle the LeadScoreUpdated event.
     *
     * @param LeadScoreUpdated $event
     */
    public function handleLeadScoreUpdated(LeadScoreUpdated $event)
    {
        Log::info("ProcessLeadWorkflows: Pontuação do Lead {$event->lead->id} atualizada para {$event->newScore}. Avaliando workflows.");
        $this->workflowService->evaluateWorkflowsForLead($event->lead, 'score_update', ['new_score' => $event->newScore]);
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
            LeadCreated::class,
            [ProcessLeadWorkflows::class, 'handleLeadCreated'],
        );

        $events->listen(
            LeadStatusChanged::class,
            [ProcessLeadWorkflows::class, 'handleLeadStatusChanged'],
        );

        $events->listen(
            LeadScoreUpdated::class,
            [ProcessLeadWorkflows::class, 'handleLeadScoreUpdated'],
        );
    }
}
