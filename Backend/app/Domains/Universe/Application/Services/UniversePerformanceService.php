<?php

namespace App\Domains\Universe\Application\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Service para otimização de performance do Universe
 * Monitora e otimiza operações críticas
 */
class UniversePerformanceService
{
    protected array $performanceMetrics = [];
    protected float $startTime;

    public function __construct()
    {
        $this->startTime = microtime(true);
    }

    /**
     * Otimiza queries com eager loading
     */
    public function optimizeQueries($query, array $relations = []): void
    {
        if (!empty($relations)) {
            $query->with($relations);
        }
    }

    /**
     * Executa operações em lote para melhor performance
     */
    public function batchOperation(array $data, callable $operation, int $batchSize = 100): array
    {
        $results = [];
        $batches = array_chunk($data, $batchSize);

        foreach ($batches as $batch) {
            $results[] = $operation($batch);
        }

        return $results;
    }

    /**
     * Monitora performance de operações
     */
    public function monitorOperation(string $operation, callable $callback)
    {
        $startTime = microtime(true);
        $startMemory = memory_get_usage();

        try {
            $result = $callback();
            
            $this->recordMetrics($operation, $startTime, $startMemory);
            
            return $result;
        } catch (\Exception $e) {
            $this->recordMetrics($operation, $startTime, $startMemory, $e);
            throw $e;
        }
    }

    /**
     * Registra métricas de performance
     */
    protected function recordMetrics(string $operation, float $startTime, int $startMemory, ?\Exception $exception = null): void
    {
        $executionTime = microtime(true) - $startTime;
        $memoryUsed = memory_get_usage() - $startMemory;
        $peakMemory = memory_get_peak_usage();

        $metrics = [
            'operation' => $operation,
            'execution_time' => $executionTime,
            'memory_used' => $memoryUsed,
            'peak_memory' => $peakMemory,
            'timestamp' => now(),
            'success' => $exception === null,
            'error' => $exception ? $exception->getMessage() : null
        ];

        $this->performanceMetrics[] = $metrics;

        // Log performance crítica
        if ($executionTime > 2.0 || $memoryUsed > 50 * 1024 * 1024) { // 2s ou 50MB
            Log::warning('Universe performance issue', $metrics);
        }
    }

    /**
     * Obtém métricas de performance
     */
    public function getMetrics(): array
    {
        return [
            'total_operations' => count($this->performanceMetrics),
            'average_execution_time' => $this->calculateAverage('execution_time'),
            'average_memory_used' => $this->calculateAverage('memory_used'),
            'peak_memory' => max(array_column($this->performanceMetrics, 'peak_memory')),
            'success_rate' => $this->calculateSuccessRate(),
            'operations' => $this->performanceMetrics
        ];
    }

    /**
     * Calcula média de métrica
     */
    protected function calculateAverage(string $metric): float
    {
        if (empty($this->performanceMetrics)) {
            return 0;
        }

        $values = array_column($this->performanceMetrics, $metric);
        return array_sum($values) / count($values);
    }

    /**
     * Calcula taxa de sucesso
     */
    protected function calculateSuccessRate(): float
    {
        if (empty($this->performanceMetrics)) {
            return 100;
        }

        $successful = array_filter($this->performanceMetrics, fn($m) => $m['success']);
        return (count($successful) / count($this->performanceMetrics)) * 100;
    }

    /**
     * Otimiza queries com índices
     */
    public function optimizeDatabaseQueries(): void
    {
        // Verifica queries lentas
        $slowQueries = DB::select("
            SELECT query, avg_time, count
            FROM mysql.slow_log 
            WHERE avg_time > 1.0 
            ORDER BY avg_time DESC 
            LIMIT 10
        ");

        if (!empty($slowQueries)) {
            Log::warning('Slow queries detected in Universe module', $slowQueries);
        }
    }

    /**
     * Limpa cache quando necessário
     */
    public function optimizeCache(): void
    {
        // Remove cache expirado
        Cache::flush();
        
        // Pre-carrega dados importantes
        $cacheService = app(UniverseCacheService::class);
        $cacheService->warmUpCache();
    }

    /**
     * Otimiza memória
     */
    public function optimizeMemory(): void
    {
        // Força garbage collection
        gc_collect_cycles();
        
        // Limpa variáveis não utilizadas
        unset($this->performanceMetrics);
        $this->performanceMetrics = [];
    }

    /**
     * Gera relatório de performance
     */
    public function generatePerformanceReport(): array
    {
        $metrics = $this->getMetrics();
        
        return [
            'summary' => [
                'total_operations' => $metrics['total_operations'],
                'average_execution_time' => round($metrics['average_execution_time'], 4),
                'average_memory_used' => $this->formatBytes($metrics['average_memory_used']),
                'peak_memory' => $this->formatBytes($metrics['peak_memory']),
                'success_rate' => round($metrics['success_rate'], 2) . '%'
            ],
            'recommendations' => $this->generateRecommendations($metrics),
            'detailed_metrics' => $metrics
        ];
    }

    /**
     * Gera recomendações de otimização
     */
    protected function generateRecommendations(array $metrics): array
    {
        $recommendations = [];

        if ($metrics['average_execution_time'] > 1.0) {
            $recommendations[] = 'Consider using database indexing for frequently queried fields';
        }

        if ($metrics['average_memory_used'] > 25 * 1024 * 1024) { // 25MB
            $recommendations[] = 'Consider implementing pagination for large datasets';
        }

        if ($metrics['success_rate'] < 95) {
            $recommendations[] = 'Review error handling and add more robust validation';
        }

        if (empty($recommendations)) {
            $recommendations[] = 'Performance is within acceptable limits';
        }

        return $recommendations;
    }

    /**
     * Formata bytes para leitura humana
     */
    protected function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}