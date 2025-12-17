<?php

namespace App\Domains\Workflows\Services;

class WorkflowDragDropService
{
    /**
     * @param array<string, mixed> $canvasDefinition
     * @return array<string, mixed>
     */
    public function updateNodePosition(array $canvasDefinition, string $nodeId, int $x, int $y): array
    {
        if (isset($canvasDefinition['drawflow']['Home']['data'][$nodeId])) {
            $canvasDefinition['drawflow']['Home']['data'][$nodeId]['pos_x'] = $x;
            $canvasDefinition['drawflow']['Home']['data'][$nodeId]['pos_y'] = $y;
        }
        return $canvasDefinition;
    }

    /**
     * @param array<string, mixed> $canvasDefinition
     * @return array<string, mixed>
     */
    public function connectNodes(array $canvasDefinition, string $fromNode, string $toNode): array
    {
        $canvasDefinition['connections'][] = [$fromNode, $toNode];
        return $canvasDefinition;
    }

    /**
     * @param array<string, mixed> $canvasDefinition
     * @return array<string, mixed>
     */
    public function disconnectNodes(array $canvasDefinition, string $fromNode, string $toNode): array
    {
        $canvasDefinition['connections'] = array_values(array_filter(
            $canvasDefinition['connections'] ?? [],
            fn ($c) => !($c[0] === $fromNode && $c[1] === $toNode),
        ));
        return $canvasDefinition;
    }
}
