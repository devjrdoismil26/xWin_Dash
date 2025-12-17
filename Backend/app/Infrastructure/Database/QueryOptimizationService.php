<?php

namespace App\Infrastructure\Database;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class QueryOptimizationService
{
    /**
     * Analisa uma query SQL e sugere otimizações.
     *
     * @param string $sql      a query SQL a ser analisada
     * @param array  $bindings os bindings da query
     *
     * @return array sugestões de otimização
     */
    public function analyzeQuery(string $sql, array $bindings = []): array
    {
        Log::info("Analisando query para otimização: {$sql}");
        $suggestions = [];

        // Simulação de análise de query
        if (str_contains(strtolower($sql), 'select *')) {
            $suggestions[] = 'Evite SELECT *, especifique as colunas necessárias.';
        }
        if (str_contains(strtolower($sql), 'where') && !str_contains(strtolower($sql), 'index')) {
            $suggestions[] = 'Considere adicionar índices às colunas usadas na cláusula WHERE.';
        }
        // Adicione mais regras de análise e sugestões

        Log::info("Análise de query concluída. Sugestões: " . json_encode($suggestions));
        return $suggestions;
    }

    /**
     * Executa uma query com um timeout e loga se for lenta.
     *
     * @param string $sql       a query SQL a ser executada
     * @param array  $bindings  os bindings da query
     * @param int    $timeoutMs o tempo limite em milissegundos
     *
     * @return array o resultado da query
     *
     * @throws \Exception se a query exceder o tempo limite
     */
    public function executeTimedQuery(string $sql, array $bindings = [], int $timeoutMs = 500): array
    {
        $startTime = microtime(true);
        $result = DB::select($sql, $bindings);
        $endTime = microtime(true);
        $queryTime = ($endTime - $startTime) * 1000;

        if ($queryTime > $timeoutMs) {
            Log::warning(
                'Slow Query Detected',
                [
                    'sql' => $sql,
                    'bindings' => $bindings,
                    'time_ms' => $queryTime,
                    'threshold_ms' => $timeoutMs,
                ],
            );
            throw new \Exception("Query excedeu o tempo limite de {$timeoutMs}ms.");
        }

        return $result;
    }

    /**
     * Enable slow query logging
     *
     * @param float $threshold Threshold in seconds
     */
    public function enableSlowQueryLogging(float $threshold = 1.0): void
    {
        // Only register listener once to prevent memory leaks
        static $listenerRegistered = false;
        
        if ($listenerRegistered) {
            return;
        }
        
        DB::listen(function ($query) use ($threshold) {
            // Limit memory usage by truncating long queries
            $sql = strlen($query->sql) > 1000 ? substr($query->sql, 0, 1000) . '...' : $query->sql;
            
            if ($query->time > $threshold * 1000) { // Convert to milliseconds
                Log::warning('Slow query detected', [
                    'sql' => $sql,
                    'bindings_count' => count($query->bindings), // Don't log full bindings to save memory
                    'time' => $query->time . 'ms'
                ]);
            }
        });
        
        $listenerRegistered = true;
    }
}
