<?php

namespace App\Domains\Workflows\Services;

use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionRepository;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

/**
 * 🚨 Workflow Error Analyzer
 *
 * Serviço especializado para análise de erros de workflows
 * Responsável por identificar padrões de erro e causas raiz
 */
class WorkflowErrorAnalyzer
{
    public function __construct(
        private WorkflowExecutionRepository $executions
    ) {
    }

    /**
     * Analisar erros do workflow
     */
    public function analyzeErrors(int $workflowId, string $period = '7d'): array
    {
        $cacheKey = "workflow_errors_{$workflowId}_{$period}";

        return Cache::remember($cacheKey, 300, function () use ($workflowId, $period) {
            $dateRange = $this->getDateRange($period);
            $executions = $this->executions->getByWorkflowId($workflowId, $dateRange);
            $failedExecutions = $executions->where('status', 'failed');

            return [
                'workflow_id' => $workflowId,
                'period' => $period,
                'error_summary' => $this->generateErrorSummary($failedExecutions),
                'common_errors' => $this->getCommonErrors($failedExecutions),
                'error_patterns' => $this->identifyErrorPatterns($failedExecutions),
                'error_trends' => $this->analyzeErrorTrends($failedExecutions, $dateRange),
                'root_causes' => $this->identifyRootCauses($failedExecutions),
                'recommendations' => $this->generateErrorRecommendations($failedExecutions)
            ];
        });
    }

    /**
     * Gerar resumo de erros
     */
    private function generateErrorSummary($failedExecutions): array
    {
        $total = $failedExecutions->count();
        $uniqueErrors = $failedExecutions->pluck('error')->unique()->count();

        $errorTypes = $this->categorizeErrors($failedExecutions);
        $mostCommonType = $errorTypes->sortDesc()->first();

        return [
            'total_errors' => $total,
            'unique_errors' => $uniqueErrors,
            'error_rate' => $total > 0 ? round(($total / $total) * 100, 2) : 0,
            'most_common_type' => $mostCommonType ? $mostCommonType->first() : null,
            'error_categories' => $errorTypes->toArray()
        ];
    }

    /**
     * Obter erros comuns
     */
    private function getCommonErrors($failedExecutions): array
    {
        $errorCounts = $failedExecutions->pluck('error')
            ->filter()
            ->countBy()
            ->sortDesc()
            ->take(10);

        $commonErrors = [];
        foreach ($errorCounts as $error => $count) {
            $commonErrors[] = [
                'error' => $error,
                'count' => $count,
                'percentage' => round(($count / $failedExecutions->count()) * 100, 2),
                'category' => $this->categorizeError($error)
            ];
        }

        return $commonErrors;
    }

    /**
     * Identificar padrões de erro
     */
    private function identifyErrorPatterns($failedExecutions): array
    {
        $patterns = [];

        // Padrão por horário
        $hourlyPatterns = $this->analyzeHourlyPatterns($failedExecutions);
        if (!empty($hourlyPatterns)) {
            $patterns['hourly'] = $hourlyPatterns;
        }

        // Padrão por dia da semana
        $dailyPatterns = $this->analyzeDailyPatterns($failedExecutions);
        if (!empty($dailyPatterns)) {
            $patterns['daily'] = $dailyPatterns;
        }

        // Padrão por tipo de erro
        $errorTypePatterns = $this->analyzeErrorTypePatterns($failedExecutions);
        if (!empty($errorTypePatterns)) {
            $patterns['error_type'] = $errorTypePatterns;
        }

        return $patterns;
    }

    /**
     * Analisar tendências de erro
     */
    private function analyzeErrorTrends($failedExecutions, array $dateRange): array
    {
        $trends = [];

        // Agrupar erros por dia
        $errorsByDay = $failedExecutions->groupBy(function ($execution) {
            return Carbon::parse($execution->started_at)->format('Y-m-d');
        });

        foreach ($errorsByDay as $date => $dayErrors) {
            $trends[] = [
                'date' => $date,
                'error_count' => $dayErrors->count(),
                'error_types' => $this->categorizeErrors($dayErrors)->toArray(),
                'most_common_error' => $dayErrors->pluck('error')->countBy()->sortDesc()->first()
            ];
        }

        // Calcular tendência geral
        $trend = $this->calculateErrorTrend($trends);

        return [
            'daily_trends' => $trends,
            'overall_trend' => $trend,
            'trend_direction' => $this->getErrorTrendDirection($trend)
        ];
    }

    /**
     * Identificar causas raiz
     */
    private function identifyRootCauses($failedExecutions): array
    {
        $rootCauses = [];

        // Analisar erros de timeout
        $timeoutErrors = $failedExecutions->filter(function ($execution) {
            return strpos(strtolower($execution->error ?? ''), 'timeout') !== false;
        });

        if ($timeoutErrors->count() > 0) {
            $rootCauses[] = [
                'type' => 'timeout',
                'description' => 'Erros de timeout indicam que o workflow está demorando muito para executar',
                'count' => $timeoutErrors->count(),
                'percentage' => round(($timeoutErrors->count() / $failedExecutions->count()) * 100, 2),
                'suggestions' => [
                    'Otimizar lógica do workflow',
                    'Aumentar timeout se necessário',
                    'Implementar processamento assíncrono'
                ]
            ];
        }

        // Analisar erros de conexão
        $connectionErrors = $failedExecutions->filter(function ($execution) {
            $error = strtolower($execution->error ?? '');
            return strpos($error, 'connection') !== false ||
                   strpos($error, 'network') !== false ||
                   strpos($error, 'unreachable') !== false;
        });

        if ($connectionErrors->count() > 0) {
            $rootCauses[] = [
                'type' => 'connection',
                'description' => 'Erros de conexão indicam problemas de rede ou serviços indisponíveis',
                'count' => $connectionErrors->count(),
                'percentage' => round(($connectionErrors->count() / $failedExecutions->count()) * 100, 2),
                'suggestions' => [
                    'Implementar retry logic',
                    'Verificar conectividade de rede',
                    'Implementar circuit breaker'
                ]
            ];
        }

        // Analisar erros de validação
        $validationErrors = $failedExecutions->filter(function ($execution) {
            $error = strtolower($execution->error ?? '');
            return strpos($error, 'validation') !== false ||
                   strpos($error, 'invalid') !== false ||
                   strpos($error, 'required') !== false;
        });

        if ($validationErrors->count() > 0) {
            $rootCauses[] = [
                'type' => 'validation',
                'description' => 'Erros de validação indicam dados inválidos ou campos obrigatórios ausentes',
                'count' => $validationErrors->count(),
                'percentage' => round(($validationErrors->count() / $failedExecutions->count()) * 100, 2),
                'suggestions' => [
                    'Melhorar validação de entrada',
                    'Adicionar validação de dados',
                    'Implementar sanitização de dados'
                ]
            ];
        }

        return $rootCauses;
    }

    /**
     * Gerar recomendações de erro
     */
    private function generateErrorRecommendations($failedExecutions): array
    {
        $recommendations = [];

        $totalErrors = $failedExecutions->count();
        $errorTypes = $this->categorizeErrors($failedExecutions);

        // Recomendação baseada no volume de erros
        if ($totalErrors > 50) {
            $recommendations[] = [
                'category' => 'monitoring',
                'title' => 'Implementar monitoramento de erros',
                'description' => 'Com muitos erros, é importante ter monitoramento em tempo real.',
                'priority' => 'high',
                'actions' => [
                    'Configurar alertas automáticos',
                    'Implementar dashboards de erro',
                    'Adicionar logging detalhado'
                ]
            ];
        }

        // Recomendação baseada no tipo de erro mais comum
        $mostCommonType = $errorTypes->sortDesc()->first();
        if ($mostCommonType && $mostCommonType->count() > 10) {
            $recommendations[] = [
                'category' => 'fix',
                'title' => "Corrigir erros de {$mostCommonType->first()}",
                'description' => "Este tipo de erro é muito comum e deve ser priorizado.",
                'priority' => 'high',
                'actions' => [
                    'Investigar causa raiz',
                    'Implementar correção',
                    'Adicionar testes para prevenir regressão'
                ]
            ];
        }

        return $recommendations;
    }

    /**
     * Categorizar erros
     */
    private function categorizeErrors($failedExecutions)
    {
        return $failedExecutions->pluck('error')
            ->filter()
            ->map(function ($error) {
                return $this->categorizeError($error);
            })
            ->countBy();
    }

    /**
     * Categorizar erro individual
     */
    private function categorizeError(string $error): string
    {
        $error = strtolower($error);

        if (strpos($error, 'timeout') !== false) {
            return 'timeout';
        } elseif (strpos($error, 'connection') !== false || strpos($error, 'network') !== false) {
            return 'connection';
        } elseif (strpos($error, 'validation') !== false || strpos($error, 'invalid') !== false) {
            return 'validation';
        } elseif (strpos($error, 'permission') !== false || strpos($error, 'unauthorized') !== false) {
            return 'permission';
        } elseif (strpos($error, 'not found') !== false || strpos($error, '404') !== false) {
            return 'not_found';
        } elseif (strpos($error, 'server error') !== false || strpos($error, '500') !== false) {
            return 'server_error';
        } else {
            return 'other';
        }
    }

    /**
     * Analisar padrões por horário
     */
    private function analyzeHourlyPatterns($failedExecutions): array
    {
        $hourlyErrors = $failedExecutions->groupBy(function ($execution) {
            return Carbon::parse($execution->started_at)->format('H');
        });

        $patterns = [];
        foreach ($hourlyErrors as $hour => $errors) {
            if ($errors->count() > 5) { // Apenas horas com muitos erros
                $patterns[] = [
                    'hour' => $hour,
                    'error_count' => $errors->count(),
                    'most_common_error' => $errors->pluck('error')->countBy()->sortDesc()->first()
                ];
            }
        }

        return $patterns;
    }

    /**
     * Analisar padrões por dia da semana
     */
    private function analyzeDailyPatterns($failedExecutions): array
    {
        $dailyErrors = $failedExecutions->groupBy(function ($execution) {
            return Carbon::parse($execution->started_at)->format('l');
        });

        $patterns = [];
        foreach ($dailyErrors as $day => $errors) {
            if ($errors->count() > 10) { // Apenas dias com muitos erros
                $patterns[] = [
                    'day' => $day,
                    'error_count' => $errors->count(),
                    'most_common_error' => $errors->pluck('error')->countBy()->sortDesc()->first()
                ];
            }
        }

        return $patterns;
    }

    /**
     * Analisar padrões por tipo de erro
     */
    private function analyzeErrorTypePatterns($failedExecutions): array
    {
        $errorTypes = $this->categorizeErrors($failedExecutions);

        $patterns = [];
        foreach ($errorTypes as $type => $count) {
            if ($count > 5) { // Apenas tipos com muitos erros
                $patterns[] = [
                    'type' => $type,
                    'count' => $count,
                    'percentage' => round(($count / $failedExecutions->count()) * 100, 2)
                ];
            }
        }

        return $patterns;
    }

    /**
     * Calcular tendência de erro
     */
    private function calculateErrorTrend(array $trends): float
    {
        if (count($trends) < 2) {
            return 0;
        }

        $first = $trends[0]['error_count'];
        $last = end($trends)['error_count'];

        if ($first === 0) {
            return 0;
        }

        return round((($last - $first) / $first) * 100, 2);
    }

    /**
     * Obter direção da tendência de erro
     */
    private function getErrorTrendDirection(float $trend): string
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
