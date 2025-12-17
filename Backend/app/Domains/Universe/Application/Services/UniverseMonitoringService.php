<?php

namespace App\Domains\Universe\Application\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;

/**
 * Service para monitoramento em produção do módulo Universe
 * Coleta métricas, detecta problemas e envia alertas
 */
class UniverseMonitoringService
{
    protected array $metrics = [];
    protected array $alerts = [];
    protected string $environment;

    public function __construct()
    {
        $this->environment = config('app.env', 'production');
    }

    /**
     * Coleta métricas do sistema
     */
    public function collectMetrics(): array
    {
        $metrics = [
            'timestamp' => now()->toISOString(),
            'environment' => $this->environment,
            'system' => $this->getSystemMetrics(),
            'database' => $this->getDatabaseMetrics(),
            'cache' => $this->getCacheMetrics(),
            'universe' => $this->getUniverseMetrics(),
            'performance' => $this->getPerformanceMetrics()
        ];

        $this->metrics = $metrics;
        return $metrics;
    }

    /**
     * Métricas do sistema
     */
    protected function getSystemMetrics(): array
    {
        return [
            'memory_usage' => memory_get_usage(true),
            'memory_peak' => memory_get_peak_usage(true),
            'memory_limit' => ini_get('memory_limit'),
            'cpu_usage' => $this->getCpuUsage(),
            'disk_usage' => $this->getDiskUsage(),
            'load_average' => sys_getloadavg(),
            'uptime' => $this->getUptime()
        ];
    }

    /**
     * Métricas do banco de dados
     */
    protected function getDatabaseMetrics(): array
    {
        try {
            $connection = DB::connection();
            $pdo = $connection->getPdo();
            
            return [
                'connection_status' => 'connected',
                'active_connections' => $this->getActiveConnections(),
                'slow_queries' => $this->getSlowQueries(),
                'table_sizes' => $this->getTableSizes(),
                'index_usage' => $this->getIndexUsage()
            ];
        } catch (\Exception $e) {
            return [
                'connection_status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Métricas do cache
     */
    protected function getCacheMetrics(): array
    {
        try {
            $driver = config('cache.default');
            
            return [
                'driver' => $driver,
                'hit_rate' => $this->getCacheHitRate(),
                'memory_usage' => $this->getCacheMemoryUsage(),
                'key_count' => $this->getCacheKeyCount()
            ];
        } catch (\Exception $e) {
            return [
                'driver' => 'unknown',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Métricas específicas do Universe
     */
    protected function getUniverseMetrics(): array
    {
        try {
            return [
                'total_instances' => $this->getTotalInstances(),
                'active_instances' => $this->getActiveInstances(),
                'total_templates' => $this->getTotalTemplates(),
                'api_requests' => $this->getApiRequests(),
                'error_rate' => $this->getErrorRate(),
                'response_time' => $this->getAverageResponseTime()
            ];
        } catch (\Exception $e) {
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Métricas de performance
     */
    protected function getPerformanceMetrics(): array
    {
        return [
            'response_time_avg' => $this->getAverageResponseTime(),
            'response_time_p95' => $this->getPercentileResponseTime(95),
            'response_time_p99' => $this->getPercentileResponseTime(99),
            'throughput' => $this->getThroughput(),
            'error_rate' => $this->getErrorRate(),
            'availability' => $this->getAvailability()
        ];
    }

    /**
     * Detecta problemas e gera alertas
     */
    public function detectIssues(): array
    {
        $issues = [];
        $metrics = $this->metrics;

        // Verificar uso de memória
        if (isset($metrics['system']['memory_usage'])) {
            $memoryUsage = $metrics['system']['memory_usage'];
            $memoryLimit = $this->parseMemoryLimit($metrics['system']['memory_limit']);
            
            if ($memoryUsage > ($memoryLimit * 0.8)) {
                $issues[] = [
                    'type' => 'high_memory_usage',
                    'severity' => 'warning',
                    'message' => 'Uso de memória alto: ' . $this->formatBytes($memoryUsage) . ' / ' . $this->formatBytes($memoryLimit),
                    'value' => $memoryUsage,
                    'threshold' => $memoryLimit * 0.8
                ];
            }
        }

        // Verificar tempo de resposta
        if (isset($metrics['performance']['response_time_avg'])) {
            $responseTime = $metrics['performance']['response_time_avg'];
            
            if ($responseTime > 2.0) {
                $issues[] = [
                    'type' => 'slow_response_time',
                    'severity' => 'warning',
                    'message' => 'Tempo de resposta lento: ' . round($responseTime, 2) . 's',
                    'value' => $responseTime,
                    'threshold' => 2.0
                ];
            }
        }

        // Verificar taxa de erro
        if (isset($metrics['performance']['error_rate'])) {
            $errorRate = $metrics['performance']['error_rate'];
            
            if ($errorRate > 5.0) {
                $issues[] = [
                    'type' => 'high_error_rate',
                    'severity' => 'critical',
                    'message' => 'Taxa de erro alta: ' . round($errorRate, 2) . '%',
                    'value' => $errorRate,
                    'threshold' => 5.0
                ];
            }
        }

        // Verificar conexões do banco
        if (isset($metrics['database']['connection_status']) && $metrics['database']['connection_status'] === 'error') {
            $issues[] = [
                'type' => 'database_connection_error',
                'severity' => 'critical',
                'message' => 'Erro de conexão com banco de dados',
                'value' => $metrics['database']['error'] ?? 'Unknown error'
            ];
        }

        $this->alerts = $issues;
        return $issues;
    }

    /**
     * Envia alertas com thresholds configuráveis
     */
    public function sendAlerts(array $thresholds = []): void
    {
        if (empty($this->alerts)) {
            return;
        }

        // Aplicar thresholds customizados
        $filteredAlerts = $this->filterAlertsByThresholds($this->alerts, $thresholds);
        
        if (empty($filteredAlerts)) {
            return;
        }

        $criticalAlerts = array_filter($filteredAlerts, fn($alert) => $alert['severity'] === 'critical');
        $warningAlerts = array_filter($filteredAlerts, fn($alert) => $alert['severity'] === 'warning');

        // Log de alertas
        Log::warning('Universe monitoring alerts', [
            'critical_count' => count($criticalAlerts),
            'warning_count' => count($warningAlerts),
            'alerts' => $filteredAlerts
        ]);

        // Enviar email para alertas críticos
        if (!empty($criticalAlerts)) {
            $this->sendEmailAlert($criticalAlerts, 'critical');
        }

        // Enviar notificação Slack para alertas de warning
        if (!empty($warningAlerts)) {
            $this->sendSlackAlert($warningAlerts);
        }
    }

    /**
     * Filter alerts by custom thresholds
     */
    protected function filterAlertsByThresholds(array $alerts, array $thresholds): array
    {
        if (empty($thresholds)) {
            return $alerts;
        }

        return array_filter($alerts, function ($alert) use ($thresholds) {
            $type = $alert['type'] ?? '';
            
            // Verificar se há threshold para este tipo
            if (!isset($thresholds[$type])) {
                return true; // Manter alerta se não há threshold específico
            }
            
            $threshold = $thresholds[$type];
            $value = $alert['value'] ?? 0;
            
            // Comparar valor com threshold
            return match ($alert['severity']) {
                'critical' => $value >= ($threshold['critical'] ?? PHP_INT_MAX),
                'warning' => $value >= ($threshold['warning'] ?? PHP_INT_MAX),
                default => true
            };
        });
    }

    /**
     * Salva métricas no banco de dados
     */
    public function saveMetrics(): void
    {
        try {
            DB::table('universe_monitoring_metrics')->insert([
                'timestamp' => now(),
                'environment' => $this->environment,
                'metrics' => json_encode($this->metrics),
                'alerts' => json_encode($this->alerts),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to save monitoring metrics', [
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Gera relatório de monitoramento
     */
    public function generateReport(): array
    {
        $this->collectMetrics();
        $issues = $this->detectIssues();

        return [
            'timestamp' => now()->toISOString(),
            'environment' => $this->environment,
            'status' => empty($issues) ? 'healthy' : 'issues_detected',
            'metrics' => $this->metrics,
            'issues' => $issues,
            'summary' => [
                'total_issues' => count($issues),
                'critical_issues' => count(array_filter($issues, fn($i) => $i['severity'] === 'critical')),
                'warning_issues' => count(array_filter($issues, fn($i) => $i['severity'] === 'warning'))
            ]
        ];
    }

    // Métodos auxiliares
    protected function getCpuUsage(): float
    {
        if (function_exists('sys_getloadavg')) {
            $load = sys_getloadavg();
            return $load[0] ?? 0.0;
        }
        return 0.0;
    }

    protected function getDiskUsage(): array
    {
        $total = disk_total_space('/');
        $free = disk_free_space('/');
        $used = $total - $free;

        return [
            'total' => $total,
            'used' => $used,
            'free' => $free,
            'percentage' => ($used / $total) * 100
        ];
    }

    protected function getUptime(): int
    {
        if (file_exists('/proc/uptime')) {
            $uptime = file_get_contents('/proc/uptime');
            return (int) explode(' ', $uptime)[0];
        }
        return 0;
    }

    protected function getActiveConnections(): int
    {
        try {
            $result = DB::select("SHOW STATUS LIKE 'Threads_connected'");
            return (int) ($result[0]->Value ?? 0);
        } catch (\Exception $e) {
            return 0;
        }
    }

    protected function getSlowQueries(): int
    {
        try {
            $result = DB::select("SHOW STATUS LIKE 'Slow_queries'");
            return (int) ($result[0]->Value ?? 0);
        } catch (\Exception $e) {
            return 0;
        }
    }

    protected function getTableSizes(): array
    {
        try {
            $tables = ['universe_instances', 'universe_templates', 'universe_snapshots'];
            $sizes = [];

            foreach ($tables as $table) {
                $result = DB::select("SELECT COUNT(*) as count FROM {$table}");
                $sizes[$table] = $result[0]->count ?? 0;
            }

            return $sizes;
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function getIndexUsage(): array
    {
        try {
            $tables = ['universe_instances', 'universe_templates', 'universe_snapshots'];
            $indexUsage = [];

            foreach ($tables as $table) {
                try {
                    $result = DB::select("SHOW INDEX FROM {$table}");
                    $indexUsage[$table] = [
                        'total_indexes' => count($result),
                        'indexes' => array_map(fn($idx) => $idx->Key_name ?? '', $result)
                    ];
                } catch (\Exception $e) {
                    $indexUsage[$table] = ['total_indexes' => 0, 'error' => $e->getMessage()];
                }
            }

            return $indexUsage;
        } catch (\Exception $e) {
            Log::warning("Erro ao obter uso de índices: " . $e->getMessage());
            return [];
        }
    }

    protected function getCacheHitRate(): float
    {
        try {
            if (config('cache.default') === 'redis') {
                $info = \Redis::info('stats');
                $hits = $info['keyspace_hits'] ?? 0;
                $misses = $info['keyspace_misses'] ?? 0;
                $total = $hits + $misses;
                
                return $total > 0 ? round(($hits / $total) * 100, 2) : 0.0;
            }
            
            // Para outros drivers, usar cache de estatísticas
            $cacheKey = 'universe:cache:stats';
            $stats = Cache::get($cacheKey, ['hits' => 0, 'misses' => 0]);
            $total = $stats['hits'] + $stats['misses'];
            
            return $total > 0 ? round(($stats['hits'] / $total) * 100, 2) : 0.0;
        } catch (\Exception $e) {
            Log::warning("Erro ao calcular hit rate do cache: " . $e->getMessage());
            return 0.0;
        }
    }

    protected function getCacheMemoryUsage(): int
    {
        try {
            if (config('cache.default') === 'redis') {
                $info = \Redis::info('memory');
                return (int) ($info['used_memory'] ?? 0);
            }
            
            // Para outros drivers, estimar baseado em chaves
            return memory_get_usage(true) * 0.1; // Estimativa: 10% da memória
        } catch (\Exception $e) {
            Log::warning("Erro ao obter uso de memória do cache: " . $e->getMessage());
            return 0;
        }
    }

    protected function getCacheKeyCount(): int
    {
        try {
            if (config('cache.default') === 'redis') {
                return (int) \Redis::dbsize();
            }
            
            // Para outros drivers, usar contagem aproximada
            return Cache::get('universe:cache:key_count', 0);
        } catch (\Exception $e) {
            Log::warning("Erro ao contar chaves do cache: " . $e->getMessage());
            return 0;
        }
    }

    protected function getTotalInstances(): int
    {
        try {
            return DB::table('universe_instances')->count();
        } catch (\Exception $e) {
            return 0;
        }
    }

    protected function getActiveInstances(): int
    {
        try {
            return DB::table('universe_instances')->where('is_active', true)->count();
        } catch (\Exception $e) {
            return 0;
        }
    }

    protected function getTotalTemplates(): int
    {
        try {
            return DB::table('universe_templates')->count();
        } catch (\Exception $e) {
            return 0;
        }
    }

    protected function getApiRequests(): int
    {
        try {
            // Contar requisições da última hora usando métricas salvas
            $lastHour = now()->subHour();
            
            // Tentar usar tabela de logs se existir
            try {
                return DB::table('universe_monitoring_metrics')
                    ->where('created_at', '>=', $lastHour)
                    ->count();
            } catch (\Exception $e) {
                // Se não existir, usar cache
                $cacheKey = 'universe:api:requests:last_hour';
                $count = (int) Cache::get($cacheKey, 0);
                
                // Incrementar contador no cache
                Cache::put($cacheKey, $count + 1, 3600);
                
                return $count;
            }
        } catch (\Exception $e) {
            Log::warning("Erro ao contar requisições da API: " . $e->getMessage());
            return 0;
        }
    }

    protected function getErrorRate(): float
    {
        try {
            // Usar métricas salvas para calcular taxa de erro
            $lastHour = now()->subHour();
            
            $metrics = DB::table('universe_monitoring_metrics')
                ->where('created_at', '>=', $lastHour)
                ->get();
            
            if ($metrics->isEmpty()) {
                return 0.0;
            }
            
            $totalAlerts = 0;
            $errorAlerts = 0;
            
            foreach ($metrics as $metric) {
                $alerts = json_decode($metric->alerts ?? '[]', true);
                $totalAlerts += count($alerts);
                $errorAlerts += count(array_filter($alerts, fn($a) => ($a['severity'] ?? '') === 'critical'));
            }
            
            return $totalAlerts > 0 ? round(($errorAlerts / $totalAlerts) * 100, 2) : 0.0;
        } catch (\Exception $e) {
            // Fallback: usar métricas salvas mais recentes
            try {
                $metrics = DB::table('universe_monitoring_metrics')
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                if ($metrics && isset($metrics->metrics)) {
                    $data = json_decode($metrics->metrics, true);
                    return $data['performance']['error_rate'] ?? 0.0;
                }
            } catch (\Exception $e2) {
                Log::warning("Erro ao calcular taxa de erro: " . $e->getMessage());
            }
            return 0.0;
        }
    }

    protected function getAverageResponseTime(): float
    {
        try {
            // Calcular baseado em métricas de performance salvas
            $lastHour = now()->subHour();
            
            $metrics = DB::table('universe_monitoring_metrics')
                ->where('created_at', '>=', $lastHour)
                ->get();
            
            if ($metrics->isEmpty()) {
                return 0.0;
            }
            
            $totalTime = 0;
            $count = 0;
            
            foreach ($metrics as $metric) {
                $data = json_decode($metric->metrics ?? '{}', true);
                $responseTime = $data['performance']['response_time_avg'] ?? 0;
                if ($responseTime > 0) {
                    $totalTime += $responseTime;
                    $count++;
                }
            }
            
            return $count > 0 ? round($totalTime / $count, 2) : 0.0;
        } catch (\Exception $e) {
            // Fallback: usar métricas salvas mais recentes
            try {
                $metrics = DB::table('universe_monitoring_metrics')
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                if ($metrics && isset($metrics->metrics)) {
                    $data = json_decode($metrics->metrics, true);
                    return $data['performance']['response_time_avg'] ?? 0.0;
                }
            } catch (\Exception $e2) {
                Log::warning("Erro ao calcular tempo médio de resposta: " . $e->getMessage());
            }
            return 0.0;
        }
    }

    protected function getPercentileResponseTime(int $percentile): float
    {
        try {
            // Calcular percentil baseado em métricas salvas
            $lastHour = now()->subHour();
            
            $responseTimes = DB::table('universe_monitoring_metrics')
                ->where('created_at', '>=', $lastHour)
                ->get()
                ->map(function ($metric) {
                    $data = json_decode($metric->metrics ?? '{}', true);
                    return $data['performance']['response_time_avg'] ?? 0;
                })
                ->filter(fn($time) => $time > 0)
                ->sort()
                ->values()
                ->toArray();
            
            if (empty($responseTimes)) {
                return 0.0;
            }
            
            $index = (int) ceil(($percentile / 100) * count($responseTimes)) - 1;
            $index = max(0, min($index, count($responseTimes) - 1));
            
            return round($responseTimes[$index] ?? 0, 2);
        } catch (\Exception $e) {
            // Fallback: estimar baseado na média
            $avg = $this->getAverageResponseTime();
            $multiplier = match($percentile) {
                95 => 2.0,
                99 => 3.0,
                default => 1.5
            };
            return round($avg * $multiplier, 2);
        }
    }

    protected function getThroughput(): int
    {
        try {
            // Contar métricas coletadas no último minuto (proxy para throughput)
            $lastMinute = now()->subMinute();
            
            return DB::table('universe_monitoring_metrics')
                ->where('created_at', '>=', $lastMinute)
                ->count();
        } catch (\Exception $e) {
            // Fallback: usar cache
            try {
                $cacheKey = 'universe:api:throughput:last_minute';
                return (int) Cache::get($cacheKey, 0);
            } catch (\Exception $e2) {
                Log::warning("Erro ao calcular throughput: " . $e->getMessage());
                return 0;
            }
        }
    }

    protected function getAvailability(): float
    {
        try {
            // Calcular disponibilidade baseado em métricas das últimas 24 horas
            $last24Hours = now()->subDay();
            
            $metrics = DB::table('universe_monitoring_metrics')
                ->where('created_at', '>=', $last24Hours)
                ->get();
            
            if ($metrics->isEmpty()) {
                return 100.0; // Sem dados, assumir disponível
            }
            
            $total = $metrics->count();
            $withErrors = 0;
            
            foreach ($metrics as $metric) {
                $alerts = json_decode($metric->alerts ?? '[]', true);
                $hasCriticalErrors = !empty(array_filter($alerts, fn($a) => ($a['severity'] ?? '') === 'critical'));
                if ($hasCriticalErrors) {
                    $withErrors++;
                }
            }
            
            $availability = (($total - $withErrors) / $total) * 100;
            return round(max(0, min(100, $availability)), 2);
        } catch (\Exception $e) {
            // Fallback: usar métricas salvas mais recentes
            try {
                $metrics = DB::table('universe_monitoring_metrics')
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                if ($metrics && isset($metrics->metrics)) {
                    $data = json_decode($metrics->metrics, true);
                    return $data['performance']['availability'] ?? 100.0;
                }
            } catch (\Exception $e2) {
                Log::warning("Erro ao calcular disponibilidade: " . $e->getMessage());
            }
            return 100.0; // Default: assumir disponível
        }
    }

    protected function parseMemoryLimit(string $limit): int
    {
        $limit = trim($limit);
        $last = strtolower($limit[strlen($limit) - 1]);
        $limit = (int) $limit;

        switch ($last) {
            case 'g':
                $limit *= 1024;
            case 'm':
                $limit *= 1024;
            case 'k':
                $limit *= 1024;
        }

        return $limit;
    }

    protected function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }

    protected function sendEmailAlert(array $alerts, string $severity): void
    {
        try {
            $to = config('universe.monitoring.email_alert_to', 'admin@xwin-dash.com');
            
            Mail::raw($this->formatAlertMessage($alerts, $severity), function ($message) use ($to, $severity) {
                $message->to($to)
                        ->subject("🚨 Universe Monitoring Alert - {$severity}");
            });
        } catch (\Exception $e) {
            Log::error('Failed to send email alert', ['error' => $e->getMessage()]);
        }
    }

    protected function sendSlackAlert(array $alerts): void
    {
        try {
            $webhookUrl = config('universe.monitoring.slack_webhook_url');
            
            if (!$webhookUrl) {
                return;
            }

            $message = $this->formatSlackMessage($alerts);
            
            Http::post($webhookUrl, [
                'text' => $message,
                'username' => 'Universe Monitor',
                'icon_emoji' => ':warning:'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send Slack alert', ['error' => $e->getMessage()]);
        }
    }

    protected function formatAlertMessage(array $alerts, string $severity): string
    {
        $message = "🚨 Universe Monitoring Alert - {$severity}\n\n";
        $message .= "Environment: {$this->environment}\n";
        $message .= "Timestamp: " . now()->toISOString() . "\n\n";
        
        foreach ($alerts as $alert) {
            $message .= "• {$alert['message']}\n";
        }
        
        return $message;
    }

    protected function formatSlackMessage(array $alerts): string
    {
        $message = "⚠️ Universe Monitoring Warning\n\n";
        
        foreach ($alerts as $alert) {
            $message .= "• {$alert['message']}\n";
        }
        
        return $message;
    }
}