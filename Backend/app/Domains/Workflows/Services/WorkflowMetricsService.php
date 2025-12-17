<?php

namespace App\Domains\Workflows\Services;

use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

/**
 * 📊 Workflow Metrics Service
 *
 * Serviço principal para métricas de workflows
 * Orquestra os serviços especializados de performance e erro
 */
class WorkflowMetricsService
{
    private WorkflowPerformanceAnalyzer $performanceAnalyzer;
    private WorkflowErrorAnalyzer $errorAnalyzer;

    public function __construct(
        private WorkflowModel $workflows,
        private WorkflowExecutionRepository $executions,
        WorkflowPerformanceAnalyzer $performanceAnalyzer,
        WorkflowErrorAnalyzer $errorAnalyzer
    ) {
        $this->performanceAnalyzer = $performanceAnalyzer;
        $this->errorAnalyzer = $errorAnalyzer;
    }

    /**
     * Obter métricas do workflow
     */
    public function getWorkflowMetrics(int $workflowId, string $period = '7d'): array
    {
        $cacheKey = "workflow_metrics_{$workflowId}_{$period}";

        return Cache::remember($cacheKey, 300, function () use ($workflowId, $period) {
            $dateRange = $this->getDateRange($period);
            $executions = $this->executions->getByWorkflowId($workflowId, $dateRange);

            return [
                'workflow_id' => $workflowId,
                'period' => $period,
                'basic_metrics' => $this->getBasicMetrics($executions),
                'performance_analysis' => $this->performanceAnalyzer->analyzePerformance($workflowId, $period),
                'error_analysis' => $this->errorAnalyzer->analyzeErrors($workflowId, $period),
                'executions_by_status' => $this->getExecutionsByStatus($executions),
                'executions_by_day' => $this->getExecutionsByDay($executions, $dateRange)
            ];
        });
    }

    /**
     * Obter métricas básicas
     */
    private function getBasicMetrics($executions): array
    {
        $total = $executions->count();
        $successful = $executions->where('status', 'completed')->count();
        $failed = $executions->where('status', 'failed')->count();
        $running = $executions->where('status', 'running')->count();

        return [
            'total_executions' => $total,
            'successful_executions' => $successful,
            'failed_executions' => $failed,
            'running_executions' => $running,
            'success_rate' => $total > 0 ? round(($successful / $total) * 100, 2) : 0,
            'failure_rate' => $total > 0 ? round(($failed / $total) * 100, 2) : 0,
            'average_execution_time' => $executions->where('execution_time', '>', 0)->avg('execution_time')
        ];
    }

    /**
     * Obter execuções por status
     */
    private function getExecutionsByStatus($executions): array
    {
        return $executions->groupBy('status')->map(function ($group) {
            return $group->count();
        })->toArray();
    }

    /**
     * Obter execuções por dia
     */
    private function getExecutionsByDay($executions, array $dateRange): array
    {
        $executionsByDay = $executions->groupBy(function ($execution) {
            return Carbon::parse($execution->started_at)->format('Y-m-d');
        });

        $result = [];
        $current = $dateRange['start']->copy();

        while ($current->lte($dateRange['end'])) {
            $date = $current->format('Y-m-d');
            $result[$date] = $executionsByDay->get($date, collect())->count();
            $current->addDay();
        }

        return $result;
    }

    /**
     * Registrar execução
     */
    public function recordExecution(int $workflowId, array $data): void
    {
        try {
            $cacheKey = "workflow_execution_{$workflowId}_" . now()->format('Y-m-d');
            $executions = Cache::get($cacheKey, []);
            $executions[] = $data;
            Cache::put($cacheKey, $executions, 86400); // 24 horas

            // Limpar cache de métricas
            $this->clearMetricsCache($workflowId);
        } catch (\Exception $e) {
            \Log::error('Erro ao registrar execução: ' . $e->getMessage(), [
                'workflow_id' => $workflowId,
                'data' => $data
            ]);
        }
    }

    /**
     * Registrar erro
     */
    public function recordError(int $workflowId, array $data): void
    {
        try {
            $cacheKey = "workflow_error_{$workflowId}_" . now()->format('Y-m-d');
            $errors = Cache::get($cacheKey, []);
            $errors[] = $data;
            Cache::put($cacheKey, $errors, 86400); // 24 horas

            // Limpar cache de métricas
            $this->clearMetricsCache($workflowId);
        } catch (\Exception $e) {
            \Log::error('Erro ao registrar erro: ' . $e->getMessage(), [
                'workflow_id' => $workflowId,
                'data' => $data
            ]);
        }
    }

    /**
     * Obter métricas de performance
     */
    public function getPerformanceMetrics(int $workflowId, string $period = '7d'): array
    {
        return $this->performanceAnalyzer->analyzePerformance($workflowId, $period);
    }

    /**
     * Obter métricas de erro
     */
    public function getErrorMetrics(int $workflowId, string $period = '7d'): array
    {
        return $this->errorAnalyzer->analyzeErrors($workflowId, $period);
    }

    /**
     * Obter métricas de todos os workflows
     */
    public function getAllWorkflowsMetrics(string $period = '7d'): array
    {
        $cacheKey = "all_workflows_metrics_{$period}";

        return Cache::remember($cacheKey, 600, function () use ($period) {
            $workflows = $this->workflows->all();
            $metrics = [];

            foreach ($workflows as $workflow) {
                $metrics[] = [
                    'workflow_id' => $workflow->id,
                    'workflow_name' => $workflow->name,
                    'basic_metrics' => $this->getBasicMetrics(
                        $this->executions->getByWorkflowId($workflow->id, $this->getDateRange($period))
                    )
                ];
            }

            return $metrics;
        });
    }

    /**
     * Obter métricas de usuário
     */
    public function getUserWorkflowsMetrics(int $userId, string $period = '7d'): array
    {
        $cacheKey = "user_workflows_metrics_{$userId}_{$period}";

        return Cache::remember($cacheKey, 600, function () use ($userId, $period) {
            $workflows = $this->workflows->where('user_id', $userId)->get();
            $metrics = [];

            foreach ($workflows as $workflow) {
                $metrics[] = [
                    'workflow_id' => $workflow->id,
                    'workflow_name' => $workflow->name,
                    'basic_metrics' => $this->getBasicMetrics(
                        $this->executions->getByWorkflowId($workflow->id, $this->getDateRange($period))
                    )
                ];
            }

            return $metrics;
        });
    }

    /**
     * Obter métricas de projeto
     */
    public function getProjectWorkflowsMetrics(int $projectId, string $period = '7d'): array
    {
        $cacheKey = "project_workflows_metrics_{$projectId}_{$period}";

        return Cache::remember($cacheKey, 600, function () use ($projectId, $period) {
            $workflows = $this->workflows->where('project_id', $projectId)->get();
            $metrics = [];

            foreach ($workflows as $workflow) {
                $metrics[] = [
                    'workflow_id' => $workflow->id,
                    'workflow_name' => $workflow->name,
                    'basic_metrics' => $this->getBasicMetrics(
                        $this->executions->getByWorkflowId($workflow->id, $this->getDateRange($period))
                    )
                ];
            }

            return $metrics;
        });
    }

    /**
     * Obter estatísticas gerais
     */
    public function getGeneralStats(): array
    {
        $cacheKey = "workflow_general_stats";

        return Cache::remember($cacheKey, 300, function () {
            $totalWorkflows = $this->workflows->count();
            $activeWorkflows = $this->workflows->where('is_active', true)->count();
            $totalExecutions = $this->executions->count();
            $successfulExecutions = $this->executions->where('status', 'completed')->count();
            $failedExecutions = $this->executions->where('status', 'failed')->count();

            return [
                'total_workflows' => $totalWorkflows,
                'active_workflows' => $activeWorkflows,
                'inactive_workflows' => $totalWorkflows - $activeWorkflows,
                'total_executions' => $totalExecutions,
                'successful_executions' => $successfulExecutions,
                'failed_executions' => $failedExecutions,
                'overall_success_rate' => $totalExecutions > 0 ? round(($successfulExecutions / $totalExecutions) * 100, 2) : 0,
                'overall_failure_rate' => $totalExecutions > 0 ? round(($failedExecutions / $totalExecutions) * 100, 2) : 0
            ];
        });
    }

    /**
     * Limpar cache de métricas
     */
    private function clearMetricsCache(int $workflowId): void
    {
        $periods = ['1d', '7d', '30d', '90d'];

        foreach ($periods as $period) {
            Cache::forget("workflow_metrics_{$workflowId}_{$period}");
            Cache::forget("workflow_performance_{$workflowId}_{$period}");
            Cache::forget("workflow_errors_{$workflowId}_{$period}");
        }
    }

    /**
     * Obter intervalo de datas
     */
    private function getDateRange(string $period): array
    {
        $endDate = Carbon::now();

        switch ($period) {
            case '1d':
                $startDate = $endDate->copy()->subDay();
                break;
            case '7d':
                $startDate = $endDate->copy()->subDays(7);
                break;
            case '30d':
                $startDate = $endDate->copy()->subDays(30);
                break;
            case '90d':
                $startDate = $endDate->copy()->subDays(90);
                break;
            default:
                $startDate = $endDate->copy()->subDays(7);
        }

        return [
            'start' => $startDate,
            'end' => $endDate
        ];
    }
}
