<?php

namespace App\Domains\Users\Http\Controllers;

use App\Domains\Users\Application\Services\UserAnalyticsService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class UserStatsController extends Controller
{
    public function __construct(
        private UserAnalyticsService $analyticsService
    ) {}

    public function overview(): JsonResponse
    {
        $stats = $this->analyticsService->getStats();
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $stats->total_users,
                'active_users' => $stats->active_users,
                'by_role' => $stats->by_role,
                'new_this_month' => $stats->new_this_month,
                'activity_rate' => $stats->activity_rate,
            ],
        ]);
    }

    public function engagement(): JsonResponse
    {
        $metrics = $this->analyticsService->getEngagementMetrics();
        
        return response()->json([
            'success' => true,
            'data' => $metrics,
        ]);
    }
}
