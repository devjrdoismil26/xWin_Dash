<?php

namespace App\Domains\Aura\ValueObjects;

class FlowExecutionResult
{
    public function __construct(
        public readonly bool $success,
        public readonly ?string $nextNodeId = null,
        public readonly array $output = [],
        public readonly ?string $error = null,
        public readonly array $metadata = []
    ) {}

    public static function success(?string $nextNodeId = null, array $output = []): self
    {
        return new self(true, $nextNodeId, $output);
    }

    public static function failure(string $error, array $metadata = []): self
    {
        return new self(false, null, [], $error, $metadata);
    }

    public function toArray(): array
    {
        return [
            'success' => $this->success,
            'next_node_id' => $this->nextNodeId,
            'output' => $this->output,
            'error' => $this->error,
            'metadata' => $this->metadata,
        ];
    }
}
