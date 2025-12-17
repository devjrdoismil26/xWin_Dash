<?php

namespace App\Domains\Workflows\Services;

class WorkflowTriggerService
{
    public function __construct(private WorkflowService $workflowService)
    {
    }

    /**
     * @param array<string, mixed> $payload
     * @return void
     */
    public function startWorkflow(int $workflowId, array $payload = []): void
    {
        $this->workflowService->startWorkflow($workflowId, $payload);
    }
}
