<?php

namespace App\Domains\Aura\ValueObjects;

class FlowStructure
{
    /**
     * @var array<int, array<string, mixed>>
     */
    private array $nodes;

    /**
     * @var array<int, array<string, mixed>>
     */
    private array $edges;

    /**
     * @param array<int, array<string, mixed>> $nodes
     * @param array<int, array<string, mixed>> $edges
     */
    public function __construct(array $nodes = [], array $edges = [])
    {
        $this->nodes = $nodes;
        $this->edges = $edges;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getNodes(): array
    {
        return $this->nodes;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getEdges(): array
    {
        return $this->edges;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'nodes' => $this->nodes,
            'edges' => $this->edges,
        ];
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['nodes'] ?? [],
            $data['edges'] ?? []
        );
    }
}
