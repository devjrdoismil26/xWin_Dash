<?php

namespace App\Domains\Workflows\Services;

use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel;

class WorkflowCanvasService
{
    public function __construct(private WorkflowModel $workflows)
    {
    }

    /**
     * @return array<string, mixed>
     */
    public function getCanvasDefinition(int $workflowId): array
    {
        $wf = $this->workflows->findOrFail($workflowId);
        return (array) ($wf->canvas_definition ?? []);
    }

    /**
     * @param array<string, mixed> $definition
     */
    public function saveCanvasDefinition(int $workflowId, array $definition): bool
    {
        $wf = $this->workflows->findOrFail($workflowId);
        if (property_exists($wf, 'canvas_definition')) {
            $wf->canvas_definition = $definition;
        }
        return $wf->save();
    }
}
