<?php

namespace App\Domains\Workflows\ValueObjects;

class TriggerWorkflowNodeConfig
{
    public function __construct(
        public string $target_workflow_id,
    ) {
    }
}
