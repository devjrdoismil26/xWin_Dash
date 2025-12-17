<?php

namespace App\Domains\Workflows\Http\Controllers;

use App\Domains\Workflows\Services\WorkflowExecutionService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkflowExecutionController extends Controller
{
    protected WorkflowExecutionService $workflowExecutionService;

    public function __construct(WorkflowExecutionService $workflowExecutionService)
    {
        $this->workflowExecutionService = $workflowExecutionService;
    }

    /**
     * Get workflow executions
     *
     * @param int $workflowId
     * @param Request $request
     * @return JsonResponse
     */
    public function executions(int $workflowId, Request $request): JsonResponse
    {
        $executions = $this->workflowExecutionService->getExecutions($workflowId, $request->all());
        return response()->json(['data' => $executions]);
    }

    /**
     * Pause execution
     *
     * @param int $executionId
     * @return JsonResponse
     */
    public function pause(int $executionId): JsonResponse
    {
        $result = $this->workflowExecutionService->pauseExecution($executionId);
        if (!$result) {
            return response()->json(['message' => 'Execution not found or cannot be paused.'], 404);
        }
        return response()->json(['data' => $result, 'message' => 'Execution paused successfully.']);
    }

    /**
     * Resume execution
     *
     * @param int $executionId
     * @return JsonResponse
     */
    public function resume(int $executionId): JsonResponse
    {
        $result = $this->workflowExecutionService->resumeExecution($executionId);
        if (!$result) {
            return response()->json(['message' => 'Execution not found or cannot be resumed.'], 404);
        }
        return response()->json(['data' => $result, 'message' => 'Execution resumed successfully.']);
    }

    /**
     * Cancel execution
     *
     * @param int $executionId
     * @return JsonResponse
     */
    public function cancel(int $executionId): JsonResponse
    {
        $result = $this->workflowExecutionService->cancelExecution($executionId);
        if (!$result) {
            return response()->json(['message' => 'Execution not found or cannot be cancelled.'], 404);
        }
        return response()->json(['data' => $result, 'message' => 'Execution cancelled successfully.']);
    }

    /**
     * Get execution logs
     *
     * @param int $executionId
     * @param Request $request
     * @return JsonResponse
     */
    public function logs(int $executionId, Request $request): JsonResponse
    {
        $logs = $this->workflowExecutionService->getExecutionLogs($executionId, $request->all());
        if (!$logs) {
            return response()->json(['message' => 'Execution not found.'], 404);
        }
        return response()->json(['data' => $logs]);
    }
}
