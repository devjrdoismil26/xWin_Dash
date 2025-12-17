<?php

namespace App\Domains\Activity\Http\Controllers;

use App\Domains\Activity\Application\Services\ActivityStatsService;
use App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityStatsController extends Controller
{
    public function __construct(
        private ActivityStatsService $statsService
    ) {}

    /**
     * AUTH-PENDENTE-006: Adicionada autorização
     */
    public function overview(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ActivityLogModel::class);
        
        $topUsers = $this->statsService->getTopUsers(10);

        return response()->json([
            'success' => true,
            'data' => [
                'top_users' => $topUsers,
            ],
        ]);
    }

    /**
     * AUTH-PENDENTE-006: Adicionada autorização
     */
    public function byUser(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ActivityLogModel::class);
        
        $limit = $request->limit ?? 10;
        $users = $this->statsService->getTopUsers($limit);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * AUTH-PENDENTE-006: Adicionada autorização
     */
    public function trends(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ActivityLogModel::class);
        
        $period = $request->period ?? 'daily';
        $trends = $this->statsService->getActivityTrends($period);

        return response()->json([
            'success' => true,
            'data' => $trends,
        ]);
    }
}
