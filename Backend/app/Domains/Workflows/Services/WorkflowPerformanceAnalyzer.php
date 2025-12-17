<?php

namespace App\Domains\Workflows\Services;

use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionRepository;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

/**
 * 📊 Workflow Performance Analyzer
 *
 * Serviço especializado para análise de performance de workflows
 * Responsável por calcular métricas de performance e tendências
 */
class WorkflowPerformanceAnalyzer
{
    public function __construct(
        private WorkflowExecutionRepository $executions
    ) {
    }

    /**
     * Analisar performance do workflow
     */
    public function analyzePerformance(int $workflowId, string $period = '7d'): array
    {
        $cacheKey = "workflow_performance_{$workflowId}_{$period}";

        return Cache::remember($cacheKey, 300, function () use ($workflowId, $period) {
            $dateRange = $this->getDateRange($period);
            $executions = $this->executions->getByWorkflowId($workflowId, $dateRange);

            return [
                'workflow_id' => $workflowId,
                'period' => $period,
                'performance_metrics' => $this->calculatePerformanceMetrics($executions),
                'execution_trends' => $this->analyzeExecutionTrends($executions, $dateRange),
                'performance_insights' => $this->generatePerformanceInsights($executions),
                'recommendations' => $this->generateRecommendations($executions)
            ];
        });
    }

    /**
     * Calcular métricas de performance
     */
    private function calculatePerformanceMetrics($executions): array
    {
        $total = $executions->count();
        $successful = $executions->where('status', 'completed')->count();
        $failed = $executions->where('status', 'failed')->count();
        $running = $executions->where('status', 'running')->count();

        $successRate = $total > 0 ? ($successful / $total) * 100 : 0;
        $failureRate = $total > 0 ? ($failed / $total) * 100 : 0;

        $executionTimes = $executions->where('execution_time', '>', 0)->pluck('execution_time');
        $avgExecutionTime = $executionTimes->avg();
        $minExecutionTime = $executionTimes->min();
        $maxExecutionTime = $executionTimes->max();

        return [
            'total_executions' => $total,
            'successful_executions' => $successful,
            'failed_executions' => $failed,
            'running_executions' => $running,
            'success_rate' => round($successRate, 2),
            'failure_rate' => round($failureRate, 2),
            'average_execution_time' => round($avgExecutionTime, 2),
            'min_execution_time' => $minExecutionTime,
            'max_execution_time' => $maxExecutionTime,
            'execution_time_std_dev' => $this->calculateStandardDeviation($executionTimes->toArray())
        ];
    }

    /**
     * Analisar tendências de execução
     */
    private function analyzeExecutionTrends($executions, array $dateRange): array
    {
        $trends = [];

        // Agrupar execuções por dia
        $executionsByDay = $executions->groupBy(function ($execution) {
            return Carbon::parse($execution->started_at)->format('Y-m-d');
        });

        foreach ($executionsByDay as $date => $dayExecutions) {
            $trends[] = [
                'date' => $date,
                'total_executions' => $dayExecutions->count(),
                'successful_executions' => $dayExecutions->where('status', 'completed')->count(),
                'failed_executions' => $dayExecutions->where('status', 'failed')->count(),
                'average_execution_time' => $dayExecutions->where('execution_time', '>', 0)->avg('execution_time')
            ];
        }

        // Calcular tendência geral
        $trend = $this->calculateTrend($trends);

        return [
            'daily_trends' => $trends,
            'overall_trend' => $trend,
            'trend_direction' => $this->getTrendDirection($trend)
        ];
    }

    /**
     * Gerar insights de performance
     */
    private function generatePerformanceInsights($executions): array
    {
        $insights = [];

        $successRate = $this->calculateSuccessRate($executions);
        $avgExecutionTime = $executions->where('execution_time', '>', 0)->avg('execution_time');

        // Insight sobre taxa de sucesso
        if ($successRate >= 95) {
            $insights[] = [
                'type' => 'success',
                'message' => 'Excelente taxa de sucesso! O workflow está funcionando de forma muito confiável.',
                'priority' => 'low'
            ];
        } elseif ($successRate >= 80) {
            $insights[] = [
                'type' => 'warning',
                'message' => 'Taxa de sucesso está boa, mas há espaço para melhorias.',
                'priority' => 'medium'
            ];
        } else {
            $insights[] = [
                'type' => 'error',
                'message' => 'Taxa de sucesso está baixa. Investigar causas das falhas.',
                'priority' => 'high'
            ];
        }

        // Insight sobre tempo de execução
        if ($avgExecutionTime > 300) { // 5 minutos
            $insights[] = [
                'type' => 'warning',
                'message' => 'Tempo médio de execução está alto. Considerar otimizações.',
                'priority' => 'medium'
            ];
        } elseif ($avgExecutionTime < 30) { // 30 segundos
            $insights[] = [
                'type' => 'success',
                'message' => 'Tempo de execução está excelente!',
                'priority' => 'low'
            ];
        }

        // Insight sobre volume de execuções
        $totalExecutions = $executions->count();
        if ($totalExecutions > 1000) {
            $insights[] = [
                'type' => 'info',
                'message' => 'Alto volume de execuções. Considerar monitoramento mais detalhado.',
                'priority' => 'medium'
            ];
        }

        return $insights;
    }

    /**
     * Gerar recomendações
     */
    private function generateRecommendations($executions): array
    {
        $recommendations = [];

        $successRate = $this->calculateSuccessRate($executions);
        $avgExecutionTime = $executions->where('execution_time', '>', 0)->avg('execution_time');
        $failureCount = $executions->where('status', 'failed')->count();

        // Recomendação sobre taxa de sucesso
        if ($successRate < 80) {
            $recommendations[] = [
                'category' => 'reliability',
                'title' => 'Melhorar confiabilidade do workflow',
                'description' => 'Investigar e corrigir as causas das falhas para aumentar a taxa de sucesso.',
                'priority' => 'high',
                'actions' => [
                    'Revisar logs de erro',
                    'Implementar retry logic',
                    'Adicionar validações adicionais'
                ]
            ];
        }

        // Recomendação sobre performance
        if ($avgExecutionTime > 300) {
            $recommendations[] = [
                'category' => 'performance',
                'title' => 'Otimizar tempo de execução',
                'description' => 'O tempo médio de execução está alto. Considerar otimizações.',
                'priority' => 'medium',
                'actions' => [
                    'Revisar lógica do workflow',
                    'Implementar cache',
                    'Otimizar consultas de banco de dados'
                ]
            ];
        }

        // Recomendação sobre monitoramento
        if ($failureCount > 10) {
            $recommendations[] = [
                'category' => 'monitoring',
                'title' => 'Implementar monitoramento avançado',
                'description' => 'Com muitas falhas, é importante ter monitoramento detalhado.',
                'priority' => 'medium',
                'actions' => [
                    'Configurar alertas automáticos',
                    'Implementar dashboards de monitoramento',
                    'Adicionar métricas customizadas'
                ]
            ];
        }

        return $recommendations;
    }

    /**
     * Calcular taxa de sucesso
     */
    private function calculateSuccessRate($executions): float
    {
        $total = $executions->count();
        if ($total === 0) {
            return 0;
        }

        $successful = $executions->where('status', 'completed')->count();
        return ($successful / $total) * 100;
    }

    /**
     * Calcular desvio padrão
     */
    private function calculateStandardDeviation(array $values): float
    {
        if (empty($values)) {
            return 0;
        }

        $mean = array_sum($values) / count($values);
        $variance = array_sum(array_map(function ($value) use ($mean) {
            return pow($value - $mean, 2);
        }, $values)) / count($values);

        return round(sqrt($variance), 2);
    }

    /**
     * Calcular tendência
     */
    private function calculateTrend(array $trends): float
    {
        if (count($trends) < 2) {
            return 0;
        }

        $first = $trends[0]['total_executions'];
        $last = end($trends)['total_executions'];

        if ($first === 0) {
            return 0;
        }

        return round((($last - $first) / $first) * 100, 2);
    }

    /**
     * Obter direção da tendência
     */
    private function getTrendDirection(float $trend): string
    {
        if ($trend > 10) {
            return 'increasing';
        } elseif ($trend < -10) {
            return 'decreasing';
        } else {
            return 'stable';
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
