<?php

namespace App\Domains\ADStool\Http\Controllers;

use App\Domains\ADStool\Services\ADSAnalyticsService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ADSAnalyticsController extends Controller
{
    protected ADSAnalyticsService $adsAnalyticsService;

    public function __construct(ADSAnalyticsService $adsAnalyticsService)
    {
        $this->adsAnalyticsService = $adsAnalyticsService;
    }

    /**
     * Get analytics summary
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function summary(Request $request): JsonResponse
    {
        $summary = $this->adsAnalyticsService->getSummary($request->all());
        return response()->json(['data' => $summary]);
    }

    /**
     * Get analytics overview
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function overview(Request $request): JsonResponse
    {
        $overview = $this->adsAnalyticsService->getOverview($request->all());
        return response()->json(['data' => $overview]);
    }

    /**
     * Get campaign analytics
     *
     * @param int $campaignId
     * @param Request $request
     * @return JsonResponse
     */
    public function campaign(int $campaignId, Request $request): JsonResponse
    {
        $analytics = $this->adsAnalyticsService->getCampaignAnalytics($campaignId, $request->all());
        if (!$analytics) {
            return response()->json(['message' => 'Campaign not found.'], 404);
        }
        return response()->json(['data' => $analytics]);
    }

    /**
     * Get account analytics
     *
     * @param int $accountId
     * @param Request $request
     * @return JsonResponse
     */
    public function account(int $accountId, Request $request): JsonResponse
    {
        $analytics = $this->adsAnalyticsService->getAccountAnalytics($accountId, $request->all());
        if (!$analytics) {
            return response()->json(['message' => 'Account not found.'], 404);
        }
        return response()->json(['data' => $analytics]);
    }
}
