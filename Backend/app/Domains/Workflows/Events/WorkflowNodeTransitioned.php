<?php

namespace App\Domains\Workflows\Events;

use App\Domains\Workflows\Models\Workflow;
use App\Domains\Workflows\Models\WorkflowLog;
use App\Domains\Workflows\Models\WorkflowNode;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkflowNodeTransitioned
{
    use Dispatchable;
    use SerializesModels;

    public Workflow $workflow;

    public WorkflowNode $fromNode;

    public WorkflowNode $toNode;

    public WorkflowLog $workflowLog;

    /**
     * @var array<string, mixed>
     */
    public array $context;

    /**
     * Create a new event instance.
     *
     * @param Workflow     $workflow
     * @param WorkflowNode $fromNode
     * @param WorkflowNode $toNode
     * @param WorkflowLog  $workflowLog
     * @param array<string, mixed>        $context
     */
    public function __construct(Workflow $workflow, WorkflowNode $fromNode, WorkflowNode $toNode, WorkflowLog $workflowLog, array $context)
    {
        $this->workflow = $workflow;
        $this->fromNode = $fromNode;
        $this->toNode = $toNode;
        $this->workflowLog = $workflowLog;
        $this->context = $context;
    }
}
