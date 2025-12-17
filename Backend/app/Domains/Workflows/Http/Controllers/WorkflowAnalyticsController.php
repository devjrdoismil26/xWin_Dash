<?php

namespace App\Domains\Workflows\Http\Controllers;

use App\Domains\Workflows\Services\WorkflowAnalyticsService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkflowAnalyticsController extends Controller
{
    protected WorkflowAnalyticsService $workflowAnalyticsService;

    public function __construct(WorkflowAnalyticsService $workflowAnalyticsService)
    {
        $this->workflowAnalyticsService = $workflowAnalyticsService;
    }

    /**
     * Get workflow metrics
     *
     * @param int $workflowId
     * @param Request $request
     * @return JsonResponse
     */
    public function metrics(int $workflowId, Request $request): JsonResponse
    {
        $metrics = $this->workflowAnalyticsService->getWorkflowMetrics($workflowId, $request->all());
        if (!$metrics) {
            return response()->json(['message' => 'Workflow not found.'], 404);
        }
        return response()->json(['data' => $metrics]);
    }

    /**
     * Get general analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function general(Request $request): JsonResponse
    {
        $analytics = $this->workflowAnalyticsService->getGeneralAnalytics($request->all());
        return response()->json(['data' => $analytics]);
    }

    /**
     * Get performance analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function performance(Request $request): JsonResponse
    {
        $analytics = $this->workflowAnalyticsService->getPerformanceAnalytics($request->all());
        return response()->json(['data' => $analytics]);
    }

    /**
     * Get executions analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function executions(Request $request): JsonResponse
    {
        $analytics = $this->workflowAnalyticsService->getExecutionsAnalytics($request->all());
        return response()->json(['data' => $analytics]);
    }

    /**
     * Get nodes analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function nodes(Request $request): JsonResponse
    {
        $analytics = $this->workflowAnalyticsService->getNodesAnalytics($request->all());
        return response()->json(['data' => $analytics]);
    }

    /**
     * Get errors analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function errors(Request $request): JsonResponse
    {
        $analytics = $this->workflowAnalyticsService->getErrorsAnalytics($request->all());
        return response()->json(['data' => $analytics]);
    }
}
