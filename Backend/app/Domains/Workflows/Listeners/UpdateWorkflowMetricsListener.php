<?php

namespace App\Domains\Workflows\Listeners;

use App\Domains\Workflows\Events\WorkflowCompleted;
use App\Domains\Workflows\Events\WorkflowFailed;
use App\Domains\Workflows\Events\WorkflowStarted;
use App\Domains\Workflows\Services\WorkflowMetricsService; // Supondo que este serviço exista
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class UpdateWorkflowMetricsListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * @var mixed
     */
    protected $workflowMetricsService;

    /**
     * @param mixed $workflowMetricsService
     */
    public function __construct($workflowMetricsService = null)
    {
        $this->workflowMetricsService = $workflowMetricsService;
    }

    /**
     * Handle the WorkflowStarted event.
     *
     * @param WorkflowStarted $event
     * @return void
     */
    public function handleWorkflowStarted(WorkflowStarted $event): void
    {
        Log::info("Registrando métrica de início para execução de workflow ID: {$event->execution->id}.");
        if ($this->workflowMetricsService && is_object($this->workflowMetricsService) && method_exists($this->workflowMetricsService, 'recordWorkflowStart')) {
            $this->workflowMetricsService->recordWorkflowStart($event->execution->id, $event->execution->workflowId);
        }
    }

    /**
     * Handle the WorkflowCompleted event.
     *
     * @param WorkflowCompleted $event
     * @return void
     */
    public function handleWorkflowCompleted(WorkflowCompleted $event): void
    {
        Log::info("Registrando métrica de conclusão para execução de workflow ID: {$event->execution->id}.");
        if ($this->workflowMetricsService && is_object($this->workflowMetricsService) && method_exists($this->workflowMetricsService, 'recordWorkflowCompletion')) {
            $this->workflowMetricsService->recordWorkflowCompletion($event->execution->id, $event->execution->workflowId, 'completed');
        }
    }

    /**
     * Handle the WorkflowFailed event.
     *
     * @param WorkflowFailed $event
     * @return void
     */
    public function handleWorkflowFailed(WorkflowFailed $event): void
    {
        Log::info("Registrando métrica de falha para execução de workflow ID: {$event->execution->id}.");
        if ($this->workflowMetricsService && is_object($this->workflowMetricsService) && method_exists($this->workflowMetricsService, 'recordWorkflowCompletion')) {
            $this->workflowMetricsService->recordWorkflowCompletion($event->execution->id, $event->execution->workflowId, 'failed', $event->errorMessage);
        }
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @param \Illuminate\Events\Dispatcher $events
     *
     * @return array<string, array<int, array<int, string>>>
     */
    public function subscribe($events): array
    {
        $events->listen(
            WorkflowStarted::class,
            [UpdateWorkflowMetricsListener::class, 'handleWorkflowStarted'],
        );

        $events->listen(
            WorkflowCompleted::class,
            [UpdateWorkflowMetricsListener::class, 'handleWorkflowCompleted'],
        );

        $events->listen(
            WorkflowFailed::class,
            [UpdateWorkflowMetricsListener::class, 'handleWorkflowFailed'],
        );

        return [];
    }
}
