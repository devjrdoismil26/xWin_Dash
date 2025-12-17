<?php

namespace App\Domains\Projects\Application\Actions;

use App\Domains\Projects\Application\DTOs\GanttDataDTO;
use App\Domains\Projects\Application\Services\GanttService;

class GenerateGanttAction
{
    public function __construct(
        private readonly GanttService $ganttService
    ) {
    }

    public function execute(string $projectId): GanttDataDTO
    {
        return $this->ganttService->generateGanttData($projectId);
    }
}
