<?php

namespace App\Domains\Projects\Http\Controllers;

use App\Domains\Projects\Application\Actions\CalculateCriticalPathAction;
use App\Domains\Projects\Application\Actions\GenerateGanttAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class GanttController extends Controller
{
    public function __construct(
        private readonly GenerateGanttAction $generateGanttAction,
        private readonly CalculateCriticalPathAction $calculateCriticalPathAction
    ) {
    }

    public function show(string $projectId): JsonResponse
    {
        $ganttData = $this->generateGanttAction->execute($projectId);
        return response()->json($ganttData->toArray());
    }

    public function calculate(string $projectId): JsonResponse
    {
        $ganttData = $this->generateGanttAction->execute($projectId);
        return response()->json($ganttData->toArray());
    }

    public function criticalPath(string $projectId): JsonResponse
    {
        $criticalPath = $this->calculateCriticalPathAction->execute($projectId);
        return response()->json(['critical_path' => $criticalPath]);
    }
}
