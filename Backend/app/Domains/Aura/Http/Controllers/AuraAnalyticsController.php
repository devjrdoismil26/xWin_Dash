<?php

namespace App\Domains\Aura\Http\Controllers;

use App\Domains\Aura\Services\AuraAnalyticsService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuraAnalyticsController extends Controller
{
    protected AuraAnalyticsService $auraAnalyticsService;

    public function __construct(AuraAnalyticsService $auraAnalyticsService)
    {
        $this->auraAnalyticsService = $auraAnalyticsService;
    }

    /**
     * Get analytics overview
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function overview(Request $request): JsonResponse
    {
        $analytics = $this->auraAnalyticsService->getOverview($request->all());
        return response()->json(['data' => $analytics]);
    }

    /**
     * Get connection analytics
     *
     * @param int $connectionId
     * @param Request $request
     * @return JsonResponse
     */
    public function connection(int $connectionId, Request $request): JsonResponse
    {
        $analytics = $this->auraAnalyticsService->getConnectionAnalytics($connectionId, $request->all());
        if (!$analytics) {
            return response()->json(['message' => 'Connection not found.'], 404);
        }
        return response()->json(['data' => $analytics]);
    }

    /**
     * Get flow analytics
     *
     * @param int $flowId
     * @param Request $request
     * @return JsonResponse
     */
    public function flow(int $flowId, Request $request): JsonResponse
    {
        $analytics = $this->auraAnalyticsService->getFlowAnalytics($flowId, $request->all());
        if (!$analytics) {
            return response()->json(['message' => 'Flow not found.'], 404);
        }
        return response()->json(['data' => $analytics]);
    }
}
