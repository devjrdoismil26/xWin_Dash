<?php

namespace App\Domains\EmailMarketing\Http\Controllers;

use App\Domains\EmailMarketing\Services\EmailAnalyticsService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailAnalyticsController extends Controller
{
    protected EmailAnalyticsService $emailAnalyticsService;

    public function __construct(EmailAnalyticsService $emailAnalyticsService)
    {
        $this->emailAnalyticsService = $emailAnalyticsService;
    }

    /**
     * Get email marketing analytics overview
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function overview(Request $request): JsonResponse
    {
        $analytics = $this->emailAnalyticsService->getOverview($request->all());
        return response()->json(['data' => $analytics]);
    }

    /**
     * Get campaign analytics
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function campaign(int $id, Request $request): JsonResponse
    {
        $analytics = $this->emailAnalyticsService->getCampaignAnalytics($id, $request->all());
        if (!$analytics) {
            return response()->json(['message' => 'Campaign not found.'], 404);
        }
        return response()->json(['data' => $analytics]);
    }

    /**
     * Get template analytics
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function template(int $id, Request $request): JsonResponse
    {
        $analytics = $this->emailAnalyticsService->getTemplateAnalytics($id, $request->all());
        if (!$analytics) {
            return response()->json(['message' => 'Template not found.'], 404);
        }
        return response()->json(['data' => $analytics]);
    }

    /**
     * Get segment analytics
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function segment(int $id, Request $request): JsonResponse
    {
        $analytics = $this->emailAnalyticsService->getSegmentAnalytics($id, $request->all());
        if (!$analytics) {
            return response()->json(['message' => 'Segment not found.'], 404);
        }
        return response()->json(['data' => $analytics]);
    }

    /**
     * Get subscribers analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function subscribers(Request $request): JsonResponse
    {
        $analytics = $this->emailAnalyticsService->getSubscribersAnalytics($request->all());
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
        $analytics = $this->emailAnalyticsService->getPerformanceAnalytics($request->all());
        return response()->json(['data' => $analytics]);
    }
}
