<?php

namespace App\Application\Workflows\Commands;

class UpdateWorkflowStatusCommand
{
    public int $workflowId;

    public string $newStatus;

    public function __construct(int $workflowId, string $newStatus)
    {
        $this->workflowId = $workflowId;
        $this->newStatus = $newStatus;
    }
}
