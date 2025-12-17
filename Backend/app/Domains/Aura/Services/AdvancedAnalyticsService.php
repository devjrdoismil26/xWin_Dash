<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraMessageModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowExecutionModel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * Advanced Analytics Service
 * 
 * Service for advanced analytics in the Aura domain.
 * Provides enhanced analytics beyond basic metrics.
 */
class AdvancedAnalyticsService
{
    /**
     * Generate advanced analytics report.
     * 
     * @param array $filters
     * @return array
     */
    public function generateReport(array $filters = []): array
    {
        try {
            Log::info("AdvancedAnalyticsService::generateReport - starting", [
                'filters' => $filters
            ]);

            $projectId = $filters['project_id'] ?? session('selected_project_id');
            $startDate = isset($filters['start_date']) ? Carbon::parse($filters['start_date']) : now()->subDays(30);
            $endDate = isset($filters['end_date']) ? Carbon::parse($filters['end_date']) : now();
            $connectionId = $filters['connection_id'] ?? null;

            // Construir query base
            $messagesQuery = AuraMessageModel::query()
                ->whereBetween('created_at', [$startDate, $endDate]);

            if ($projectId) {
                $messagesQuery->whereHas('chat', function ($q) use ($projectId) {
                    $q->where('project_id', $projectId);
                });
            }

            if ($connectionId) {
                $messagesQuery->whereHas('chat', function ($q) use ($connectionId) {
                    $q->where('connection_id', $connectionId);
                });
            }

            // Métricas de mensagens
            $totalMessages = (clone $messagesQuery)->count();
            $sentMessages = (clone $messagesQuery)->where('direction', 'outbound')->count();
            $receivedMessages = (clone $messagesQuery)->where('direction', 'inbound')->count();
            $deliveredMessages = (clone $messagesQuery)->where('status', 'delivered')->count();
            $readMessages = (clone $messagesQuery)->whereNotNull('read_at')->count();

            // Taxa de entrega e leitura
            $deliveryRate = $sentMessages > 0 ? round(($deliveredMessages / $sentMessages) * 100, 2) : 0;
            $readRate = $sentMessages > 0 ? round(($readMessages / $sentMessages) * 100, 2) : 0;

            // Distribuição por tipo de mensagem
            $messageTypes = (clone $messagesQuery)
                ->select('type', DB::raw('count(*) as count'))
                ->groupBy('type')
                ->pluck('count', 'type')
                ->toArray();

            // Distribuição por hora do dia
            $hourlyDistribution = (clone $messagesQuery)
                ->selectRaw('HOUR(created_at) as hour, COUNT(*) as count')
                ->groupBy('hour')
                ->orderBy('hour')
                ->pluck('count', 'hour')
                ->toArray();

            // Distribuição por dia da semana
            $dailyDistribution = (clone $messagesQuery)
                ->selectRaw('DAYOFWEEK(created_at) as day, COUNT(*) as count')
                ->groupBy('day')
                ->pluck('count', 'day')
                ->toArray();

            // Tempo médio de resposta
            $avgResponseTime = $this->calculateAverageResponseTime($projectId, $connectionId, $startDate, $endDate);

            // Análise de chats
            $chatsQuery = AuraChatModel::query()
                ->whereBetween('created_at', [$startDate, $endDate]);

            if ($projectId) {
                $chatsQuery->where('project_id', $projectId);
            }

            if ($connectionId) {
                $chatsQuery->where('connection_id', $connectionId);
            }

            $totalChats = $chatsQuery->count();
            $activeChats = (clone $chatsQuery)->where('status', 'active')->count();
            $closedChats = (clone $chatsQuery)->where('status', 'closed')->count();

            // Análise de fluxos
            $flowsQuery = AuraFlowExecutionModel::query()
                ->whereBetween('started_at', [$startDate, $endDate]);

            if ($projectId) {
                $flowsQuery->whereHas('flow', function ($q) use ($projectId) {
                    $q->where('project_id', $projectId);
                });
            }

            $totalFlowExecutions = $flowsQuery->count();
            $completedFlows = (clone $flowsQuery)->where('status', 'completed')->count();
            $flowCompletionRate = $totalFlowExecutions > 0 
                ? round(($completedFlows / $totalFlowExecutions) * 100, 2) 
                : 0;

            $report = [
                'success' => true,
                'period' => [
                    'start' => $startDate->toIso8601String(),
                    'end' => $endDate->toIso8601String(),
                    'days' => $startDate->diffInDays($endDate)
                ],
                'messages' => [
                    'total' => $totalMessages,
                    'sent' => $sentMessages,
                    'received' => $receivedMessages,
                    'delivered' => $deliveredMessages,
                    'read' => $readMessages,
                    'delivery_rate' => $deliveryRate,
                    'read_rate' => $readRate,
                    'types_distribution' => $messageTypes,
                    'hourly_distribution' => $hourlyDistribution,
                    'daily_distribution' => $dailyDistribution,
                    'avg_response_time_seconds' => $avgResponseTime
                ],
                'chats' => [
                    'total' => $totalChats,
                    'active' => $activeChats,
                    'closed' => $closedChats,
                    'active_rate' => $totalChats > 0 ? round(($activeChats / $totalChats) * 100, 2) : 0
                ],
                'flows' => [
                    'total_executions' => $totalFlowExecutions,
                    'completed' => $completedFlows,
                    'completion_rate' => $flowCompletionRate
                ],
                'generated_at' => now()->toIso8601String()
            ];

            Log::info("AdvancedAnalyticsService::generateReport - success", [
                'total_messages' => $totalMessages,
                'total_chats' => $totalChats
            ]);

            return $report;
        } catch (\Exception $e) {
            Log::error("AdvancedAnalyticsService::generateReport - error", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'data' => [],
                'message' => 'Erro ao gerar relatório: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Calculate average response time.
     */
    protected function calculateAverageResponseTime(?string $projectId, ?string $connectionId, Carbon $startDate, Carbon $endDate): float
    {
        try {
            $query = DB::table('aura_messages as m1')
                ->join('aura_messages as m2', function ($join) {
                    $join->on('m1.chat_id', '=', 'm2.chat_id')
                        ->where('m1.direction', '=', 'inbound')
                        ->where('m2.direction', '=', 'outbound')
                        ->whereRaw('m2.created_at > m1.created_at')
                        ->whereRaw('m2.created_at = (SELECT MIN(created_at) FROM aura_messages WHERE chat_id = m1.chat_id AND direction = "outbound" AND created_at > m1.created_at)');
                })
                ->whereBetween('m1.created_at', [$startDate, $endDate])
                ->selectRaw('AVG(TIMESTAMPDIFF(SECOND, m1.created_at, m2.created_at)) as avg_response_time');

            if ($projectId) {
                $query->join('aura_chats as c', 'm1.chat_id', '=', 'c.id')
                    ->where('c.project_id', $projectId);
            }

            if ($connectionId) {
                $query->join('aura_chats as c', 'm1.chat_id', '=', 'c.id')
                    ->where('c.connection_id', $connectionId);
            }

            $result = $query->first();
            return $result ? (float) $result->avg_response_time : 0.0;
        } catch (\Exception $e) {
            Log::warning("Erro ao calcular tempo médio de resposta: " . $e->getMessage());
            return 0.0;
        }
    }

    /**
     * Get predictive analytics.
     * 
     * @param string $metricType
     * @param array $options
     * @return array
     */
    public function getPredictiveAnalytics(string $metricType, array $options = []): array
    {
        try {
            Log::info("AdvancedAnalyticsService::getPredictiveAnalytics - starting", [
                'metric_type' => $metricType
            ]);

            $projectId = $options['project_id'] ?? session('selected_project_id');
            $days = $options['days'] ?? 30;
            $forecastDays = $options['forecast_days'] ?? 7;

            // Obter dados históricos
            $historicalData = $this->getHistoricalData($metricType, $projectId, $days);

            // Calcular tendência simples (média móvel)
            $predictions = $this->calculateSimpleForecast($historicalData, $forecastDays);

            // Calcular confiança baseada na variância histórica
            $confidence = $this->calculateConfidence($historicalData);

            Log::info("AdvancedAnalyticsService::getPredictiveAnalytics - success", [
                'metric_type' => $metricType,
                'forecast_days' => $forecastDays
            ]);

            return [
                'success' => true,
                'metric_type' => $metricType,
                'historical_data' => $historicalData,
                'predictions' => $predictions,
                'confidence' => $confidence,
                'forecast_period' => $forecastDays,
                'generated_at' => now()->toIso8601String()
            ];
        } catch (\Exception $e) {
            Log::error("AdvancedAnalyticsService::getPredictiveAnalytics - error", [
                'metric_type' => $metricType,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'predictions' => [],
                'message' => 'Erro ao calcular analytics preditivos: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get historical data for a metric.
     */
    protected function getHistoricalData(string $metricType, ?string $projectId, int $days): array
    {
        $startDate = now()->subDays($days);
        $data = [];

        switch ($metricType) {
            case 'messages_per_day':
                $query = AuraMessageModel::query()
                    ->where('created_at', '>=', $startDate)
                    ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                    ->groupBy('date')
                    ->orderBy('date');

                if ($projectId) {
                    $query->whereHas('chat', function ($q) use ($projectId) {
                        $q->where('project_id', $projectId);
                    });
                }

                $data = $query->get()->pluck('count', 'date')->toArray();
                break;

            case 'active_chats':
                $query = AuraChatModel::query()
                    ->where('created_at', '>=', $startDate)
                    ->where('status', 'active')
                    ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                    ->groupBy('date')
                    ->orderBy('date');

                if ($projectId) {
                    $query->where('project_id', $projectId);
                }

                $data = $query->get()->pluck('count', 'date')->toArray();
                break;

            default:
                $data = [];
        }

        return $data;
    }

    /**
     * Calculate simple forecast using moving average.
     */
    protected function calculateSimpleForecast(array $historicalData, int $forecastDays): array
    {
        if (empty($historicalData)) {
            return [];
        }

        $values = array_values($historicalData);
        $avg = array_sum($values) / count($values);

        $predictions = [];
        $lastDate = max(array_keys($historicalData));
        $baseDate = Carbon::parse($lastDate);

        for ($i = 1; $i <= $forecastDays; $i++) {
            $forecastDate = $baseDate->copy()->addDays($i)->format('Y-m-d');
            $predictions[$forecastDate] = round($avg, 2);
        }

        return $predictions;
    }

    /**
     * Calculate confidence based on historical variance.
     */
    protected function calculateConfidence(array $historicalData): float
    {
        if (count($historicalData) < 2) {
            return 0.5; // Baixa confiança com poucos dados
        }

        $values = array_values($historicalData);
        $mean = array_sum($values) / count($values);
        $variance = 0;

        foreach ($values as $value) {
            $variance += pow($value - $mean, 2);
        }

        $variance = $variance / count($values);
        $stdDev = sqrt($variance);
        $coefficientOfVariation = $mean > 0 ? $stdDev / $mean : 1;

        // Confiança inversamente proporcional à variação
        $confidence = max(0.1, min(0.95, 1 - ($coefficientOfVariation * 0.5)));

        return round($confidence, 2);
    }
}
