<?php

namespace App\Domains\Workflows\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionModel;

class DashboardController extends Controller
{
    /**
     * Get Workflows Dashboard data
     * Endpoint: GET /api/workflows/dashboard
     */
    public function dashboard(): JsonResponse
    {
        try {
            $userId = auth()->id();

            // Buscar workflows reais do banco
            $workflows = WorkflowModel::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->limit(20)
                ->get()
                ->map(function($workflow) {
                    $executions = WorkflowExecutionModel::where('workflow_id', $workflow->id)->count();
                    $successful = WorkflowExecutionModel::where('workflow_id', $workflow->id)
                        ->where('status', 'completed')
                        ->count();

                    // Get trigger type from workflow definition
                    $triggerType = 'manual';
                    if ($workflow->definition && is_array($workflow->definition)) {
                        $triggerType = $workflow->definition['trigger']['type'] ?? 'manual';
                    } elseif ($workflow->trigger_type) {
                        $triggerType = $workflow->trigger_type;
                    }

                    return [
                        'id' => $workflow->id,
                        'name' => $workflow->name,
                        'description' => $workflow->description,
                        'status' => $workflow->status ?? 'draft',
                        'trigger' => $triggerType,
                        'execution_count' => $executions,
                        'success_rate' => $executions > 0 ? round(($successful / $executions) * 100, 2) : 0,
                        'last_executed_at' => $workflow->last_executed_at?->toISOString(),
                        'created_at' => $workflow->created_at->toISOString(),
                    ];
                });

            // Recent executions
            $recentExecutions = WorkflowExecutionModel::whereIn('workflow_id', function($query) use ($userId) {
                    $query->select('id')
                        ->from('workflows')
                        ->where('user_id', $userId);
                })
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function($execution) {
                    return [
                        'id' => $execution->id,
                        'workflow_id' => $execution->workflow_id,
                        'status' => $execution->status,
                        'started_at' => $execution->started_at?->toISOString(),
                        'completed_at' => $execution->completed_at?->toISOString(),
                        'duration_ms' => $execution->started_at && $execution->completed_at
                            ? $execution->started_at->diffInMilliseconds($execution->completed_at)
                            : null,
                        'created_at' => $execution->created_at->toISOString(),
                    ];
                });

            // Stats
            $totalWorkflows = WorkflowModel::where('user_id', $userId)->count();
            $activeWorkflows = WorkflowModel::where('user_id', $userId)->where('status', 'active')->count();
            $pausedWorkflows = WorkflowModel::where('user_id', $userId)->where('status', 'paused')->count();
            $draftWorkflows = WorkflowModel::where('user_id', $userId)->where('status', 'draft')->count();

            $allExecutions = WorkflowExecutionModel::whereIn('workflow_id', function($query) use ($userId) {
                $query->select('id')->from('workflows')->where('user_id', $userId);
            });

            $totalExecutions = $allExecutions->count();
            $successfulExecutions = (clone $allExecutions)->where('status', 'completed')->count();
            $failedExecutions = (clone $allExecutions)->where('status', 'failed')->count();

            // Calculate real average execution time
            $averageExecutionTime = 0;
            if ($totalExecutions > 0) {
                $completedExecutions = (clone $allExecutions)
                    ->where('status', 'completed')
                    ->whereNotNull('started_at')
                    ->whereNotNull('completed_at')
                    ->get();
                
                if ($completedExecutions->isNotEmpty()) {
                    $totalDuration = $completedExecutions->sum(function($execution) {
                        return $execution->started_at->diffInMilliseconds($execution->completed_at);
                    });
                    $averageExecutionTime = round($totalDuration / $completedExecutions->count());
                }
            }

            $stats = [
                'total_workflows' => $totalWorkflows,
                'active_workflows' => $activeWorkflows,
                'paused_workflows' => $pausedWorkflows,
                'draft_workflows' => $draftWorkflows,
                'total_executions' => $totalExecutions,
                'successful_executions' => $successfulExecutions,
                'failed_executions' => $failedExecutions,
                'average_execution_time_ms' => $averageExecutionTime,
                'success_rate' => $totalExecutions > 0 ? round(($successfulExecutions / $totalExecutions) * 100, 2) : 0,
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'workflows' => $workflows->toArray(),
                    'recent_executions' => $recentExecutions->toArray(),
                    'stats' => $stats,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
