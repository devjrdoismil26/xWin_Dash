<?php

namespace App\Domains\Activity\Http\Controllers;

use App\Domains\Activity\Application\Actions\ExportActivitiesAction;
use App\Domains\Activity\Application\Actions\GetActivityStatsAction;
use App\Domains\Activity\Application\DTOs\ActivityExportDTO;
use App\Domains\Activity\Application\DTOs\ActivityFilterDTO;
use App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogModel;
use App\Domains\Activity\Models\ActivityLog;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * ActivityLogController
 * 
 * SECURITY FIX (AUTH-007): Implementada filtragem por project_id para multi-tenancy
 */
class ActivityLogController extends Controller
{
    public function __construct(
        private GetActivityStatsAction $statsAction,
        private ExportActivitiesAction $exportAction
    ) {}

    /**
     * Get current project ID for multi-tenancy
     */
    protected function getProjectId(): ?string
    {
        return session('selected_project_id');
    }

    /**
     * IMPL-004: Refatorado para usar ActivityLogModel (Eloquent)
     * AUTH-014: Adicionada autorização
     */
    public function index(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ActivityLog::class);
        
        $projectId = $this->getProjectId();

        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $query = ActivityLogModel::query();

        // Filtros adicionais
        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->entity_type) {
            $query->where('entity_type', $request->entity_type);
        }
        if ($request->action) {
            $query->where('action', $request->action);
        }
        if ($request->date_from) {
            $query->where('created_at', '>=', Carbon::parse($request->date_from));
        }
        if ($request->date_to) {
            $query->where('created_at', '<=', Carbon::parse($request->date_to));
        }

        $logs = $query->orderByDesc('created_at')
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }

    /**
     * IMPL-004: Refatorado para usar ActivityLogModel (Eloquent)
     * AUTH-014: Adicionada autorização
     */
    public function show(string $id): JsonResponse
    {
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $logModel = ActivityLogModel::findOrFail($id);
        
        // SECURITY: Verificar autorização
        $log = ActivityLog::findOrFail($id);
        $this->authorize('view', $log);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $log->id,
                'user_id' => $log->user_id,
                'entity_type' => $log->entity_type,
                'entity_id' => $log->entity_id,
                'action' => $log->action,
                'description' => $log->description,
                'properties' => $log->properties,
                'project_id' => $log->project_id,
                'created_at' => $log->created_at->toISOString(),
                'updated_at' => $log->updated_at->toISOString(),
            ],
        ]);
    }

    /**
     * AUTH-PENDENTE-007: Adicionada autorização
     */
    public function stats(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ActivityLog::class);
        
        $filters = new ActivityFilterDTO(
            user_id: $request->user_id,
            entity_type: $request->entity_type,
            entity_id: $request->entity_id,
            action: $request->action,
            date_from: $request->date_from ? Carbon::parse($request->date_from) : null,
            date_to: $request->date_to ? Carbon::parse($request->date_to) : null
        );

        $stats = $this->statsAction->execute($filters);

        return response()->json([
            'success' => true,
            'data' => [
                'total_activities' => $stats->total_activities,
                'by_type' => $stats->by_type,
                'by_user' => $stats->by_user,
            ],
        ]);
    }

    /**
     * AUTH-PENDENTE-007: Adicionada autorização
     */
    public function export(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ActivityLog::class);
        
        $request->validate([
            'format' => 'required|in:csv,json',
        ]);

        $filters = new ActivityFilterDTO(
            user_id: $request->user_id,
            entity_type: $request->entity_type,
            entity_id: $request->entity_id,
            action: $request->action,
            date_from: $request->date_from ? Carbon::parse($request->date_from) : null,
            date_to: $request->date_to ? Carbon::parse($request->date_to) : null
        );

        $dto = new ActivityExportDTO(
            format: $request->format,
            filters: $filters,
            include_metadata: $request->include_metadata ?? true
        );

        $content = $this->exportAction->execute($dto);

        return response()->json([
            'success' => true,
            'data' => $content,
        ]);
    }

    /**
     * IMPL-004: Refatorado para usar ActivityLogModel (Eloquent)
     * AUTH-014: Adicionada autorização
     */
    public function destroy(string $id): JsonResponse
    {
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $logModel = ActivityLogModel::findOrFail($id);
        
        // SECURITY: Verificar autorização
        $log = ActivityLog::findOrFail($id);
        $this->authorize('delete', $log);
        
        $logModel->delete();

        return response()->json([
            'success' => true,
            'message' => 'Activity log deleted',
        ]);
    }

    /**
     * IMPL-004: Refatorado para usar ActivityLogModel (Eloquent)
     * AUTH-014: Adicionada autorização
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('delete', ActivityLog::class);
        
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|string'
        ]);

        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $logs = ActivityLogModel::whereIn('id', $request->ids)->get();
        $deleted = $logs->count();
        
        foreach ($logs as $log) {
            $log->delete();
        }

        return response()->json([
            'success' => true,
            'message' => "Deleted {$deleted} activity logs",
            'deleted_count' => $deleted
        ]);
    }

    /**
     * IMPL-004: Refatorado para usar ActivityLogModel (Eloquent)
     * AUTH-014: Adicionada autorização (apenas admin)
     */
    public function clear(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização (apenas admin pode limpar logs)
        $this->authorize('delete', ActivityLog::class);
        
        $query = ActivityLogModel::query();

        if ($request->date_before) {
            $query->where('created_at', '<', Carbon::parse($request->date_before));
        }

        if ($request->user_id) {
            $query->where('causer_id', $request->user_id);
        }

        $deleted = $query->count();
        $query->delete();

        return response()->json([
            'success' => true,
            'message' => "Cleared {$deleted} activity logs",
            'deleted_count' => $deleted
        ]);
    }

    /**
     * IMPL-004: Refatorado para usar ActivityLogModel (Eloquent)
     * AUTH-PENDENTE-015: Adicionada autorização
     */
    public function getFilters(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ActivityLog::class);
        
        $types = ActivityLogModel::select('subject_type')
            ->distinct()
            ->whereNotNull('subject_type')
            ->pluck('subject_type');

        $actions = ActivityLogModel::select('description')
            ->distinct()
            ->whereNotNull('description')
            ->pluck('description');

        $users = ActivityLogModel::with('causer')
            ->whereNotNull('causer_id')
            ->get()
            ->pluck('causer')
            ->filter()
            ->unique('id')
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name ?? 'Unknown'
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'types' => $types,
                'actions' => $actions,
                'users' => $users
            ]
        ]);
    }

    /**
     * AUTH-PENDENTE-007: Adicionada autorização e refatorado para usar Model
     */
    public function getRealtime(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ActivityLog::class);
        
        $since = $request->since 
            ? Carbon::parse($request->since) 
            : Carbon::now()->subMinutes(5);

        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $logs = ActivityLogModel::query()
            ->where('created_at', '>', $since)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $logs,
            'timestamp' => now()->toISOString()
        ]);
    }

    /**
     * AUTH-PENDENTE-007: Adicionada autorização e refatorado para usar Model
     */
    public function getUserActivity(string $userId): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ActivityLog::class);
        
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $logs = ActivityLogModel::query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    /**
     * AUTH-PENDENTE-007: Adicionada autorização e refatorado para usar Model
     */
    public function getUserStats(string $userId): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ActivityLog::class);
        
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $baseQuery = ActivityLogModel::query()->where('user_id', $userId);
        
        $total = (clone $baseQuery)->count();

        $byType = (clone $baseQuery)
            ->select('entity_type')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('entity_type')
            ->get();

        $byAction = (clone $baseQuery)
            ->select('action')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('action')
            ->get();

        $recent = (clone $baseQuery)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_activities' => $total,
                'by_type' => $byType,
                'by_action' => $byAction,
                'recent_activities' => $recent
            ]
        ]);
    }

    /**
     * AUTH-PENDENTE-007: Adicionada autorização e refatorado para usar Model
     */
    public function getSystemHealth(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ActivityLog::class);
        
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $baseQuery = ActivityLogModel::query();
        
        $totalLogs = (clone $baseQuery)->count();
        $logsToday = (clone $baseQuery)
            ->whereDate('created_at', today())
            ->count();
        
        $logsLastHour = (clone $baseQuery)
            ->where('created_at', '>', now()->subHour())
            ->count();

        $activeUsers = (clone $baseQuery)
            ->where('created_at', '>', now()->subDay())
            ->distinct('user_id')
            ->count('user_id');

        $errorRate = (clone $baseQuery)
            ->where('action', 'like', '%error%')
            ->where('created_at', '>', now()->subDay())
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_logs' => $totalLogs,
                'logs_today' => $logsToday,
                'logs_last_hour' => $logsLastHour,
                'active_users_24h' => $activeUsers,
                'error_count_24h' => $errorRate,
                'health_status' => $logsLastHour > 0 ? 'healthy' : 'warning'
            ]
        ]);
    }

    /**
     * AUTH-PENDENTE-007: Adicionada autorização e refatorado para usar Model
     */
    public function stream(Request $request)
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ActivityLog::class);
        
        return response()->stream(function () use ($request) {
            $lastId = $request->query('lastId', 0);
            
            while (true) {
                // SECURITY: Usar Model com BelongsToProject (filtro automático)
                $logs = ActivityLogModel::query()
                    ->where('id', '>', $lastId)
                    ->orderBy('id', 'asc')
                    ->limit(10)
                    ->get();

                if ($logs->isNotEmpty()) {
                    foreach ($logs as $log) {
                        echo "data: " . json_encode($log) . "\n\n";
                        ob_flush();
                        flush();
                        $lastId = $log->id;
                    }
                }

                if (connection_aborted()) {
                    break;
                }

                sleep(2);
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
