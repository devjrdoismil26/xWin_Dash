<?php

namespace App\Domains\Aura\ValueObjects;

class FlowExecutionContext
{
    public function __construct(
        public readonly string $executionId,
        public readonly string $flowId,
        public readonly string $phoneNumber,
        public array $variables = [],
        public ?string $currentNodeId = null,
        public array $history = []
    ) {}

    public function addToHistory(string $nodeId, array $output): void
    {
        $this->history[] = [
            'node_id' => $nodeId,
            'output' => $output,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    public function setVariable(string $key, mixed $value): void
    {
        $this->variables[$key] = $value;
    }

    public function getVariable(string $key, mixed $default = null): mixed
    {
        return $this->variables[$key] ?? $default;
    }

    public function toArray(): array
    {
        return [
            'execution_id' => $this->executionId,
            'flow_id' => $this->flowId,
            'phone_number' => $this->phoneNumber,
            'variables' => $this->variables,
            'current_node_id' => $this->currentNodeId,
            'history' => $this->history,
        ];
    }
}
