<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraMessageModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

/**
 * Enterprise Scaling Service
 * 
 * Service for enterprise-level scaling features in the Aura domain.
 * Handles scaling, load balancing, and enterprise features.
 */
class EnterpriseScalingService
{
    protected array $scalingThresholds = [
        'cpu' => 80, // %
        'memory' => 80, // %
        'message_queue' => 1000, // messages
        'concurrent_connections' => 100, // connections
        'response_time' => 2000, // ms
    ];

    /**
     * Scale Aura services based on load.
     * 
     * @param array $metrics
     * @return array
     */
    public function scaleServices(array $metrics): array
    {
        try {
            Log::info("EnterpriseScalingService::scaleServices - starting", [
                'metrics_keys' => array_keys($metrics)
            ]);

            $scalingActions = [];
            $currentMetrics = $this->getCurrentMetrics();

            // Analisar cada métrica e determinar ações de scaling
            foreach ($currentMetrics as $metricName => $value) {
                $threshold = $this->scalingThresholds[$metricName] ?? null;
                
                if ($threshold && $value > $threshold) {
                    $action = $this->determineScalingAction($metricName, $value, $threshold);
                    if ($action) {
                        $scalingActions[] = $action;
                    }
                }
            }

            // Executar ações de scaling
            $scaledServices = [];
            foreach ($scalingActions as $action) {
                $result = $this->executeScalingAction($action);
                if ($result['success']) {
                    $scaledServices[] = $result;
                }
            }

            // Registrar scaling no cache para monitoramento
            Cache::put('aura:scaling:last_action', [
                'timestamp' => now()->toIso8601String(),
                'actions' => $scalingActions,
                'scaled_services' => $scaledServices
            ], now()->addHours(1));

            Log::info("EnterpriseScalingService::scaleServices - success", [
                'actions_taken' => count($scalingActions),
                'services_scaled' => count($scaledServices)
            ]);

            return [
                'success' => true,
                'scaled_services' => $scaledServices,
                'actions_taken' => count($scalingActions),
                'message' => count($scalingActions) > 0 
                    ? 'Serviços escalados com sucesso' 
                    : 'Nenhuma ação de scaling necessária'
            ];
        } catch (\Exception $e) {
            Log::error("EnterpriseScalingService::scaleServices - error", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'scaled_services' => [],
                'message' => 'Erro ao escalar serviços: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get current system metrics.
     */
    protected function getCurrentMetrics(): array
    {
        // CPU usage (simulado - em produção, usar ferramentas de monitoramento)
        $cpuUsage = $this->getCpuUsage();

        // Memory usage
        $memoryUsage = $this->getMemoryUsage();

        // Message queue size
        $messageQueueSize = AuraMessageModel::where('status', 'pending')
            ->orWhere('status', 'queued')
            ->count();

        // Concurrent connections
        $concurrentConnections = AuraConnectionModel::where('status', 'connected')
            ->count();

        // Average response time (últimas 100 mensagens)
        $avgResponseTime = $this->getAverageResponseTime();

        return [
            'cpu' => $cpuUsage,
            'memory' => $memoryUsage,
            'message_queue' => $messageQueueSize,
            'concurrent_connections' => $concurrentConnections,
            'response_time' => $avgResponseTime
        ];
    }

    /**
     * Get CPU usage (simulated).
     */
    protected function getCpuUsage(): float
    {
        // Em produção, usar ferramentas como sys_getloadavg() ou APIs de monitoramento
        try {
            $load = sys_getloadavg();
            return $load ? min(100, ($load[0] / 4) * 100) : 50.0; // Normalizar para 0-100%
        } catch (\Exception $e) {
            // Fallback: estimar baseado em atividade
            $recentMessages = AuraMessageModel::where('created_at', '>=', now()->subMinutes(5))->count();
            return min(100, ($recentMessages / 10) * 5); // 5% por 10 mensagens
        }
    }

    /**
     * Get memory usage.
     */
    protected function getMemoryUsage(): float
    {
        try {
            $memoryUsage = memory_get_usage(true);
            $memoryLimit = ini_get('memory_limit');
            $memoryLimitBytes = $this->convertToBytes($memoryLimit);
            
            return $memoryLimitBytes > 0 
                ? round(($memoryUsage / $memoryLimitBytes) * 100, 2) 
                : 0.0;
        } catch (\Exception $e) {
            return 50.0; // Fallback
        }
    }

    /**
     * Get average response time.
     */
    protected function getAverageResponseTime(): float
    {
        try {
            $recentMessages = AuraMessageModel::where('created_at', '>=', now()->subHour())
                ->whereNotNull('sent_at')
                ->whereNotNull('delivered_at')
                ->selectRaw('AVG(TIMESTAMPDIFF(MILLISECOND, sent_at, delivered_at)) as avg_time')
                ->value('avg_time');

            return $recentMessages ? (float) $recentMessages : 0.0;
        } catch (\Exception $e) {
            return 0.0;
        }
    }

    /**
     * Convert memory limit string to bytes.
     */
    protected function convertToBytes(string $memoryLimit): int
    {
        $memoryLimit = trim($memoryLimit);
        $last = strtolower($memoryLimit[strlen($memoryLimit) - 1]);
        $value = (int) $memoryLimit;

        return match ($last) {
            'g' => $value * 1024 * 1024 * 1024,
            'm' => $value * 1024 * 1024,
            'k' => $value * 1024,
            default => $value
        };
    }

    /**
     * Determine scaling action based on metric.
     */
    protected function determineScalingAction(string $metricName, float $value, float $threshold): ?array
    {
        $excess = (($value - $threshold) / $threshold) * 100;
        $scaleFactor = 1;

        if ($excess > 50) {
            $scaleFactor = 2; // Scale up 2x
        } elseif ($excess > 25) {
            $scaleFactor = 1.5; // Scale up 1.5x
        }

        return [
            'metric' => $metricName,
            'current_value' => $value,
            'threshold' => $threshold,
            'excess_percentage' => round($excess, 2),
            'action' => 'scale_up',
            'scale_factor' => $scaleFactor,
            'service' => $this->getServiceForMetric($metricName)
        ];
    }

    /**
     * Get service name for metric.
     */
    protected function getServiceForMetric(string $metricName): string
    {
        return match ($metricName) {
            'cpu', 'memory' => 'message_processor',
            'message_queue' => 'queue_worker',
            'concurrent_connections' => 'connection_manager',
            'response_time' => 'api_gateway',
            default => 'general_service'
        };
    }

    /**
     * Execute scaling action.
     */
    protected function executeScalingAction(array $action): array
    {
        try {
            $service = $action['service'];
            $scaleFactor = $action['scale_factor'];

            // Em produção, aqui integraria com orquestradores (Kubernetes, Docker Swarm, etc.)
            // Por enquanto, registrar a ação e retornar sucesso simulado

            Log::info("Executando ação de scaling", [
                'service' => $service,
                'scale_factor' => $scaleFactor,
                'action' => $action
            ]);

            // Registrar ação no cache
            $scalingHistory = Cache::get('aura:scaling:history', []);
            $scalingHistory[] = [
                'service' => $service,
                'scale_factor' => $scaleFactor,
                'timestamp' => now()->toIso8601String(),
                'action' => $action
            ];
            Cache::put('aura:scaling:history', array_slice($scalingHistory, -100), now()->addDays(7));

            return [
                'success' => true,
                'service' => $service,
                'scale_factor' => $scaleFactor,
                'message' => "Serviço {$service} escalado por fator de {$scaleFactor}x",
                'note' => 'Em produção, esta ação escalaria recursos reais (workers, containers, etc.)'
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao executar ação de scaling", [
                'action' => $action,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'service' => $action['service'] ?? 'unknown',
                'message' => 'Erro ao executar scaling: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get scaling recommendations.
     * 
     * @param array $options
     * @return array
     */
    public function getScalingRecommendations(array $options = []): array
    {
        try {
            Log::info("EnterpriseScalingService::getScalingRecommendations - starting");

            $currentMetrics = $this->getCurrentMetrics();
            $recommendations = [];

            foreach ($currentMetrics as $metricName => $value) {
                $threshold = $this->scalingThresholds[$metricName] ?? null;
                
                if ($threshold) {
                    $percentage = ($value / $threshold) * 100;
                    
                    if ($percentage > 100) {
                        $recommendations[] = [
                            'metric' => $metricName,
                            'current_value' => $value,
                            'threshold' => $threshold,
                            'status' => 'critical',
                            'recommendation' => $this->getRecommendationForMetric($metricName, $value, $threshold),
                            'priority' => 'high'
                        ];
                    } elseif ($percentage > 80) {
                        $recommendations[] = [
                            'metric' => $metricName,
                            'current_value' => $value,
                            'threshold' => $threshold,
                            'status' => 'warning',
                            'recommendation' => $this->getRecommendationForMetric($metricName, $value, $threshold),
                            'priority' => 'medium'
                        ];
                    }
                }
            }

            // Análise de tendências
            $trends = $this->analyzeTrends();

            Log::info("EnterpriseScalingService::getScalingRecommendations - success", [
                'recommendations_count' => count($recommendations)
            ]);

            return [
                'success' => true,
                'current_metrics' => $currentMetrics,
                'recommendations' => $recommendations,
                'trends' => $trends,
                'generated_at' => now()->toIso8601String()
            ];
        } catch (\Exception $e) {
            Log::error("EnterpriseScalingService::getScalingRecommendations - error", [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'recommendations' => [],
                'message' => 'Erro ao obter recomendações: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get recommendation for specific metric.
     */
    protected function getRecommendationForMetric(string $metricName, float $value, float $threshold): string
    {
        return match ($metricName) {
            'cpu' => "CPU usage está em {$value}% (threshold: {$threshold}%). Considere escalar workers de processamento de mensagens.",
            'memory' => "Memory usage está em {$value}% (threshold: {$threshold}%). Considere aumentar limite de memória ou escalar horizontalmente.",
            'message_queue' => "Fila de mensagens tem {$value} mensagens (threshold: {$threshold}). Considere aumentar número de queue workers.",
            'concurrent_connections' => "Há {$value} conexões ativas (threshold: {$threshold}). Considere distribuir carga entre múltiplos servidores.",
            'response_time' => "Tempo médio de resposta está em {$value}ms (threshold: {$threshold}ms). Considere otimizar queries ou escalar API gateway.",
            default => "Métrica {$metricName} está acima do threshold. Considere escalar recursos relacionados."
        };
    }

    /**
     * Analyze trends for predictive recommendations.
     */
    protected function analyzeTrends(): array
    {
        try {
            // Analisar tendências das últimas 24 horas
            $hourlyMetrics = [];

            for ($i = 23; $i >= 0; $i--) {
                $hour = now()->subHours($i);
                $messageCount = AuraMessageModel::whereBetween('created_at', [
                    $hour->copy()->startOfHour(),
                    $hour->copy()->endOfHour()
                ])->count();

                $hourlyMetrics[] = [
                    'hour' => $hour->format('Y-m-d H:00:00'),
                    'message_count' => $messageCount
                ];
            }

            // Calcular tendência
            $firstHalf = array_slice($hourlyMetrics, 0, 12);
            $secondHalf = array_slice($hourlyMetrics, 12);

            $firstHalfAvg = array_sum(array_column($firstHalf, 'message_count')) / 12;
            $secondHalfAvg = array_sum(array_column($secondHalf, 'message_count')) / 12;

            $trend = $secondHalfAvg > $firstHalfAvg ? 'increasing' : ($secondHalfAvg < $firstHalfAvg ? 'decreasing' : 'stable');
            $changePercentage = $firstHalfAvg > 0 
                ? round((($secondHalfAvg - $firstHalfAvg) / $firstHalfAvg) * 100, 2) 
                : 0;

            return [
                'trend' => $trend,
                'change_percentage' => $changePercentage,
                'first_half_avg' => round($firstHalfAvg, 2),
                'second_half_avg' => round($secondHalfAvg, 2),
                'recommendation' => $trend === 'increasing' && $changePercentage > 20
                    ? 'Tendência de aumento detectada. Considere scaling proativo.'
                    : 'Tendência estável ou decrescente. Monitorar continuamente.'
            ];
        } catch (\Exception $e) {
            Log::warning("Erro ao analisar tendências: " . $e->getMessage());
            return [
                'trend' => 'unknown',
                'recommendation' => 'Não foi possível analisar tendências'
            ];
        }
    }
}
