<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

/**
 * 🚀 Analytics Service
 * 
 * Serviço centralizado para analytics de todas as plataformas
 * Inclui coleta, processamento e agregação de métricas
 */
class AnalyticsService
{
    private array $platformServices = [];
    private array $metricTypes = [
        'impressions' => 'Impressões',
        'clicks' => 'Cliques',
        'spend' => 'Gasto',
        'reach' => 'Alcance',
        'frequency' => 'Frequência',
        'cpm' => 'CPM',
        'cpc' => 'CPC',
        'ctr' => 'CTR',
        'cpp' => 'CPP',
        'cost_per_conversion' => 'Custo por Conversão',
        'conversions' => 'Conversões',
        'conversion_values' => 'Valor das Conversões',
        'engagement' => 'Engajamento',
        'likes' => 'Curtidas',
        'shares' => 'Compartilhamentos',
        'comments' => 'Comentários',
        'followers' => 'Seguidores',
        'views' => 'Visualizações',
        'retweets' => 'Retweets',
        'messages_sent' => 'Mensagens Enviadas',
        'messages_received' => 'Mensagens Recebidas',
        'response_time' => 'Tempo de Resposta',
    ];

    public function __construct()
    {
        // Inicializar serviços de plataforma
        $this->initializePlatformServices();
    }

    /**
     * Coleta métricas de uma plataforma específica
     */
    public function collectMetrics(string $platform, string $accountId, array $params = []): array
    {
        if (!isset($this->platformServices[$platform])) {
            throw new \Exception("Platform {$platform} not supported");
        }

        $service = $this->platformServices[$platform];
        $defaultParams = [
            'start_date' => Carbon::now()->subDays(30)->format('Y-m-d'),
            'end_date' => Carbon::now()->format('Y-m-d'),
            'granularity' => 'day'
        ];

        $params = array_merge($defaultParams, $params);

        try {
            $metrics = $service->getMetrics($accountId, $params);
            
            // Processar e normalizar métricas
            $processedMetrics = $this->processMetrics($platform, $metrics);
            
            // Salvar no cache
            $this->cacheMetrics($platform, $accountId, $processedMetrics);
            
            return $processedMetrics;
        } catch (\Exception $e) {
            Log::error("Failed to collect metrics for {$platform}", [
                'account_id' => $accountId,
                'params' => $params,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Coleta métricas de múltiplas plataformas
     */
    public function collectMultiPlatformMetrics(array $platforms, array $params = []): array
    {
        $results = [];
        
        foreach ($platforms as $platform => $accountId) {
            try {
                $results[$platform] = $this->collectMetrics($platform, $accountId, $params);
            } catch (\Exception $e) {
                $results[$platform] = [
                    'error' => $e->getMessage(),
                    'success' => false
                ];
            }
        }
        
        return $results;
    }

    /**
     * Obtém métricas agregadas
     */
    public function getAggregatedMetrics(array $platforms, array $params = []): array
    {
        $allMetrics = $this->collectMultiPlatformMetrics($platforms, $params);
        
        $aggregated = [
            'total_impressions' => 0,
            'total_clicks' => 0,
            'total_spend' => 0,
            'total_reach' => 0,
            'total_conversions' => 0,
            'total_conversion_values' => 0,
            'total_engagement' => 0,
            'platforms' => []
        ];

        foreach ($allMetrics as $platform => $metrics) {
            if (isset($metrics['error'])) {
                continue;
            }

            $platformData = [
                'platform' => $platform,
                'metrics' => $metrics,
                'summary' => $this->calculateSummary($metrics)
            ];

            $aggregated['platforms'][] = $platformData;

            // Agregar totais
            $aggregated['total_impressions'] += $metrics['impressions'] ?? 0;
            $aggregated['total_clicks'] += $metrics['clicks'] ?? 0;
            $aggregated['total_spend'] += $metrics['spend'] ?? 0;
            $aggregated['total_reach'] += $metrics['reach'] ?? 0;
            $aggregated['total_conversions'] += $metrics['conversions'] ?? 0;
            $aggregated['total_conversion_values'] += $metrics['conversion_values'] ?? 0;
            $aggregated['total_engagement'] += $metrics['engagement'] ?? 0;
        }

        // Calcular métricas derivadas
        $aggregated['overall_ctr'] = $aggregated['total_impressions'] > 0 
            ? ($aggregated['total_clicks'] / $aggregated['total_impressions']) * 100 
            : 0;
        
        $aggregated['overall_cpm'] = $aggregated['total_impressions'] > 0 
            ? ($aggregated['total_spend'] / $aggregated['total_impressions']) * 1000 
            : 0;
        
        $aggregated['overall_cpc'] = $aggregated['total_clicks'] > 0 
            ? $aggregated['total_spend'] / $aggregated['total_clicks'] 
            : 0;

        return $aggregated;
    }

    /**
     * Obtém métricas em tempo real
     */
    public function getRealTimeMetrics(string $platform, string $accountId): array
    {
        $cacheKey = "realtime_metrics:{$platform}:{$accountId}";
        $cached = Cache::get($cacheKey);
        
        if ($cached && Carbon::parse($cached['timestamp'])->isAfter(Carbon::now()->subMinutes(5))) {
            return $cached['data'];
        }

        try {
            $service = $this->platformServices[$platform];
            $metrics = $service->getRealTimeMetrics($accountId);
            
            $data = [
                'timestamp' => Carbon::now()->toISOString(),
                'data' => $this->processMetrics($platform, $metrics)
            ];
            
            Cache::put($cacheKey, $data, 300); // 5 minutos
            
            return $data['data'];
        } catch (\Exception $e) {
            Log::error("Failed to get real-time metrics for {$platform}", [
                'account_id' => $accountId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Obtém relatório de performance
     */
    public function getPerformanceReport(array $platforms, array $params = []): array
    {
        $metrics = $this->getAggregatedMetrics($platforms, $params);
        
        $report = [
            'period' => [
                'start_date' => $params['start_date'] ?? Carbon::now()->subDays(30)->format('Y-m-d'),
                'end_date' => $params['end_date'] ?? Carbon::now()->format('Y-m-d')
            ],
            'summary' => [
                'total_platforms' => count($platforms),
                'total_spend' => $metrics['total_spend'],
                'total_impressions' => $metrics['total_impressions'],
                'total_clicks' => $metrics['total_clicks'],
                'overall_ctr' => $metrics['overall_ctr'],
                'overall_cpm' => $metrics['overall_cpm'],
                'overall_cpc' => $metrics['overall_cpc']
            ],
            'platforms' => $metrics['platforms'],
            'insights' => $this->generateInsights($metrics),
            'recommendations' => $this->generateRecommendations($metrics)
        ];

        return $report;
    }

    /**
     * Obtém métricas históricas
     */
    public function getHistoricalMetrics(string $platform, string $accountId, int $days = 90): array
    {
        $cacheKey = "historical_metrics:{$platform}:{$accountId}:{$days}";
        $cached = Cache::get($cacheKey);
        
        if ($cached) {
            return $cached;
        }

        $params = [
            'start_date' => Carbon::now()->subDays($days)->format('Y-m-d'),
            'end_date' => Carbon::now()->format('Y-m-d'),
            'granularity' => 'day'
        ];

        $metrics = $this->collectMetrics($platform, $accountId, $params);
        
        Cache::put($cacheKey, $metrics, 3600); // 1 hora
        
        return $metrics;
    }

    /**
     * Compara performance entre períodos
     */
    public function comparePeriods(string $platform, string $accountId, array $period1, array $period2): array
    {
        $metrics1 = $this->collectMetrics($platform, $accountId, $period1);
        $metrics2 = $this->collectMetrics($platform, $accountId, $period2);
        
        $comparison = [];
        
        foreach ($this->metricTypes as $metric => $label) {
            $value1 = $metrics1[$metric] ?? 0;
            $value2 = $metrics2[$metric] ?? 0;
            
            $change = $value1 > 0 ? (($value2 - $value1) / $value1) * 100 : 0;
            
            $comparison[$metric] = [
                'label' => $label,
                'period1' => $value1,
                'period2' => $value2,
                'change_percent' => round($change, 2),
                'change_absolute' => $value2 - $value1,
                'trend' => $change > 0 ? 'up' : ($change < 0 ? 'down' : 'stable')
            ];
        }
        
        return $comparison;
    }

    /**
     * Obtém métricas de ROI
     */
    public function getROIMetrics(array $platforms, array $params = []): array
    {
        $metrics = $this->getAggregatedMetrics($platforms, $params);
        
        $roi = [
            'total_investment' => $metrics['total_spend'],
            'total_return' => $metrics['total_conversion_values'],
            'roi_percentage' => $metrics['total_spend'] > 0 
                ? (($metrics['total_conversion_values'] - $metrics['total_spend']) / $metrics['total_spend']) * 100 
                : 0,
            'roi_ratio' => $metrics['total_spend'] > 0 
                ? $metrics['total_conversion_values'] / $metrics['total_spend'] 
                : 0,
            'cost_per_acquisition' => $metrics['total_conversions'] > 0 
                ? $metrics['total_spend'] / $metrics['total_conversions'] 
                : 0,
            'lifetime_value' => $metrics['total_conversions'] > 0 
                ? $metrics['total_conversion_values'] / $metrics['total_conversions'] 
                : 0
        ];
        
        return $roi;
    }

    // Métodos privados

    private function initializePlatformServices(): void
    {
        // Aqui você injetaria os serviços reais das plataformas
        // Por enquanto, vamos simular
        $this->platformServices = [
            'facebook' => new class {
                public function getMetrics($accountId, $params) {
                    return [
                        'impressions' => rand(1000, 10000),
                        'clicks' => rand(50, 500),
                        'spend' => rand(100, 1000),
                        'reach' => rand(800, 8000),
                        'conversions' => rand(5, 50)
                    ];
                }
                public function getRealTimeMetrics($accountId) {
                    return [
                        'impressions' => rand(10, 100),
                        'clicks' => rand(1, 10),
                        'spend' => rand(5, 50)
                    ];
                }
            },
            'google' => new class {
                public function getMetrics($accountId, $params) {
                    return [
                        'impressions' => rand(2000, 20000),
                        'clicks' => rand(100, 1000),
                        'spend' => rand(200, 2000),
                        'reach' => rand(1500, 15000),
                        'conversions' => rand(10, 100)
                    ];
                }
                public function getRealTimeMetrics($accountId) {
                    return [
                        'impressions' => rand(20, 200),
                        'clicks' => rand(2, 20),
                        'spend' => rand(10, 100)
                    ];
                }
            },
            'twitter' => new class {
                public function getMetrics($accountId, $params) {
                    return [
                        'impressions' => rand(500, 5000),
                        'clicks' => rand(25, 250),
                        'spend' => rand(50, 500),
                        'reach' => rand(400, 4000),
                        'conversions' => rand(2, 20)
                    ];
                }
                public function getRealTimeMetrics($accountId) {
                    return [
                        'impressions' => rand(5, 50),
                        'clicks' => rand(1, 5),
                        'spend' => rand(2, 20)
                    ];
                }
            }
        ];
    }

    private function processMetrics(string $platform, array $metrics): array
    {
        $processed = [];
        
        foreach ($metrics as $key => $value) {
            if (isset($this->metricTypes[$key])) {
                $processed[$key] = $value;
            }
        }
        
        // Adicionar métricas calculadas
        if (isset($processed['impressions']) && isset($processed['clicks'])) {
            $processed['ctr'] = $processed['impressions'] > 0 
                ? ($processed['clicks'] / $processed['impressions']) * 100 
                : 0;
        }
        
        if (isset($processed['spend']) && isset($processed['impressions'])) {
            $processed['cpm'] = $processed['impressions'] > 0 
                ? ($processed['spend'] / $processed['impressions']) * 1000 
                : 0;
        }
        
        if (isset($processed['spend']) && isset($processed['clicks'])) {
            $processed['cpc'] = $processed['clicks'] > 0 
                ? $processed['spend'] / $processed['clicks'] 
                : 0;
        }
        
        return $processed;
    }

    private function cacheMetrics(string $platform, string $accountId, array $metrics): void
    {
        $cacheKey = "metrics:{$platform}:{$accountId}:" . Carbon::now()->format('Y-m-d');
        Cache::put($cacheKey, $metrics, 3600); // 1 hora
    }

    private function calculateSummary(array $metrics): array
    {
        return [
            'total_impressions' => $metrics['impressions'] ?? 0,
            'total_clicks' => $metrics['clicks'] ?? 0,
            'total_spend' => $metrics['spend'] ?? 0,
            'ctr' => $metrics['ctr'] ?? 0,
            'cpm' => $metrics['cpm'] ?? 0,
            'cpc' => $metrics['cpc'] ?? 0
        ];
    }

    private function generateInsights(array $metrics): array
    {
        $insights = [];
        
        if ($metrics['overall_ctr'] > 2) {
            $insights[] = "CTR acima da média da indústria (2%)";
        }
        
        if ($metrics['overall_cpm'] < 5) {
            $insights[] = "CPM abaixo da média, boa eficiência de custo";
        }
        
        if ($metrics['total_conversions'] > 0) {
            $insights[] = "Conversões positivas detectadas";
        }
        
        return $insights;
    }

    private function generateRecommendations(array $metrics): array
    {
        $recommendations = [];
        
        if ($metrics['overall_ctr'] < 1) {
            $recommendations[] = "Considere otimizar criativos para melhorar CTR";
        }
        
        if ($metrics['overall_cpm'] > 10) {
            $recommendations[] = "Avalie ajustar targeting para reduzir CPM";
        }
        
        if ($metrics['total_conversions'] == 0) {
            $recommendations[] = "Revise estratégia de conversão";
        }
        
        return $recommendations;
    }
}