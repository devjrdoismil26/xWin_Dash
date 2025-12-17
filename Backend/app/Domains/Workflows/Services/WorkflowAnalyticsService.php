<?php

namespace App\Domains\Workflows\Services;

use App\Domains\Workflows\Models\Workflow;
use App\Domains\Workflows\Models\WorkflowExecution;
use Illuminate\Support\Facades\DB;

class WorkflowAnalyticsService
{
    /**
     * Get workflow execution statistics
     */
    public function getExecutionStats(string $workflowId, int $days = 30): array
    {
        $workflow = Workflow::find($workflowId);
        if (!$workflow) {
            return [];
        }

        $executions = WorkflowExecution::where('workflow_id', $workflowId)
            ->where('created_at', '>=', now()->subDays($days))
            ->get();

        $totalExecutions = $executions->count();
        $successfulExecutions = $executions->where('status', 'completed')->count();
        $failedExecutions = $executions->where('status', 'failed')->count();
        $runningExecutions = $executions->where('status', 'running')->count();

        return [
            'total_executions' => $totalExecutions,
            'successful_executions' => $successfulExecutions,
            'failed_executions' => $failedExecutions,
            'running_executions' => $runningExecutions,
            'success_rate' => $totalExecutions > 0 ? round(($successfulExecutions / $totalExecutions) * 100, 2) : 0,
            'average_execution_time' => $this->getAverageExecutionTime($executions),
        ];
    }

    /**
     * Get average execution time
     */
    private function getAverageExecutionTime($executions): float
    {
        $completedExecutions = $executions->where('status', 'completed');

        if ($completedExecutions->isEmpty()) {
            return 0;
        }

        $totalTime = $completedExecutions->sum(function ($execution) {
            if ($execution->started_at && $execution->completed_at) {
                return $execution->completed_at->diffInSeconds($execution->started_at);
            }
            return 0;
        });

        return round($totalTime / $completedExecutions->count(), 2);
    }

    /**
     * Get workflow performance trends
     */
    public function getPerformanceTrends(string $workflowId, int $days = 30): array
    {
        $workflow = Workflow::find($workflowId);
        if (!$workflow) {
            return [];
        }

        $trends = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');

            $dayExecutions = WorkflowExecution::where('workflow_id', $workflowId)
                ->whereDate('created_at', $date)
                ->get();

            $trends[] = [
                'date' => $date,
                'total_executions' => $dayExecutions->count(),
                'successful_executions' => $dayExecutions->where('status', 'completed')->count(),
                'failed_executions' => $dayExecutions->where('status', 'failed')->count(),
                'success_rate' => $dayExecutions->count() > 0
                    ? round(($dayExecutions->where('status', 'completed')->count() / $dayExecutions->count()) * 100, 2)
                    : 0,
            ];
        }

        return $trends;
    }

    /**
     * Get most used workflows
     */
    public function getMostUsedWorkflows(int $limit = 10): array
    {
        return Workflow::withCount('executions')
            ->orderBy('executions_count', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($workflow) {
                return [
                    'id' => $workflow->id,
                    'name' => $workflow->name,
                    'executions_count' => $workflow->executions_count,
                    'success_rate' => $this->getWorkflowSuccessRate($workflow->id),
                ];
            })
            ->toArray();
    }

    /**
     * Get workflow success rate
     */
    private function getWorkflowSuccessRate(string $workflowId): float
    {
        $executions = WorkflowExecution::where('workflow_id', $workflowId)->get();

        if ($executions->isEmpty()) {
            return 0;
        }

        $successfulExecutions = $executions->where('status', 'completed')->count();
        return round(($successfulExecutions / $executions->count()) * 100, 2);
    }
}
