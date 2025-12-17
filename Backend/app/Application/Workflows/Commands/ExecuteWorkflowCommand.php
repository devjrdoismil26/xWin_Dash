<?php

namespace App\Application\Workflows\Commands;

class ExecuteWorkflowCommand
{
    public int $workflowId;
    public int $userId;
    public ?array $payload;
    public ?string $executionMode;
    public ?string $priority;
    public ?int $timeout;
    public ?int $maxRetries;

    public function __construct(
        int $workflowId,
        int $userId,
        ?array $payload = null,
        ?string $executionMode = null,
        ?string $priority = null,
        ?int $timeout = null,
        ?int $maxRetries = null
    ) {
        $this->workflowId = $workflowId;
        $this->userId = $userId;
        $this->payload = $payload;
        $this->executionMode = $executionMode;
        $this->priority = $priority;
        $this->timeout = $timeout;
        $this->maxRetries = $maxRetries;
    }
}