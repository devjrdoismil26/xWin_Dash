<?php

namespace App\Domains\Aura\Application\Commands;

class ProcessAuraWorkflowCommand
{
    public function __construct(
        public readonly string $workflowType,
        public readonly array $data,
        public readonly ?string $trigger = null,
        public readonly ?array $context = null,
        public readonly ?array $parameters = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'workflow_type' => $this->workflowType,
            'data' => $this->data,
            'trigger' => $this->trigger,
            'context' => $this->context,
            'parameters' => $this->parameters
        ];
    }
}
