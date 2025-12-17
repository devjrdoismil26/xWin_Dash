<?php

namespace App\Domains\Workflows\ValueObjects;

use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;

final class NodeConnection
{
    /**
     * @param array<string, mixed>|null $condition
     */
    public function __construct(public readonly string $targetNodeId, public readonly ?array $condition = null)
    {
        $this->validate();
    }

    /**
     * @throws \Illuminate\Validation\ValidationException
     */
    private function validate(): void
    {
        $validator = Validator::make($this->toArray(), [
            'target_node_id' => 'required|uuid|exists:workflow_nodes,id',
            'condition' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            throw new InvalidArgumentException('Invalid data provided for NodeConnection.');
        }
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self($data["target_node_id"], $data["condition"] ?? null);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return ["target_node_id" => $this->targetNodeId, "condition" => $this->condition];
    }
}
