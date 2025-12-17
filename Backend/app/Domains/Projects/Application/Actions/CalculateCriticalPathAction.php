<?php

namespace App\Domains\Projects\Application\Actions;

use App\Domains\Projects\Application\Services\GanttService;

class CalculateCriticalPathAction
{
    public function __construct(
        private readonly GanttService $ganttService
    ) {
    }

    public function execute(string $projectId): array
    {
        $ganttData = $this->ganttService->generateGanttData($projectId);
        return $ganttData->criticalPath ?? [];
    }
}
