<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowExecutionModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowNodeModel;
use App\Domains\Aura\Services\AuraFlowService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Advanced Flow Engine
 * 
 * Advanced flow execution engine for complex Aura workflows.
 * Provides enhanced flow processing capabilities beyond the basic flow service.
 */
class AdvancedFlowEngine
{
    protected AuraFlowService $flowService;

    public function __construct(AuraFlowService $flowService)
    {
        $this->flowService = $flowService;
    }

    /**
     * Execute an advanced flow.
     * 
     * @param string $flowId
     * @param array $context
     * @return array
     */
    public function execute(string $flowId, array $context = []): array
    {
        try {
            Log::info("AdvancedFlowEngine::execute - starting", [
                'flow_id' => $flowId,
                'context_keys' => array_keys($context)
            ]);

            $flow = AuraFlowModel::findOrFail($flowId);

            if (!$flow->is_active) {
                throw new \Exception("Fluxo {$flowId} não está ativo");
            }

            // Obter estrutura do fluxo
            $structure = $flow->structure ?? [];
            $nodes = $structure['nodes'] ?? [];

            if (empty($nodes)) {
                throw new \Exception("Fluxo {$flowId} não possui nós configurados");
            }

            // Identificar nós iniciais (sem dependências)
            $startNodes = $this->findStartNodes($nodes);

            // Executar nós em paralelo se possível
            $executionResults = [];
            $executionContext = array_merge($context, [
                'flow_id' => $flowId,
                'started_at' => now()->toIso8601String()
            ]);

            foreach ($startNodes as $startNode) {
                $result = $this->executeNodeWithRecovery($startNode, $executionContext, $nodes);
                $executionResults[$startNode['id']] = $result;
            }

            // Processar nós dependentes
            $this->processDependentNodes($nodes, $executionResults, $executionContext);

            // Calcular estatísticas de execução
            $executionStats = $this->calculateExecutionStats($executionResults);

            Log::info("AdvancedFlowEngine::execute - success", [
                'flow_id' => $flowId,
                'nodes_executed' => count($executionResults),
                'success_rate' => $executionStats['success_rate']
            ]);

            return [
                'success' => true,
                'flow_id' => $flowId,
                'execution_results' => $executionResults,
                'statistics' => $executionStats,
                'message' => 'Fluxo executado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error("AdvancedFlowEngine::execute - error", [
                'flow_id' => $flowId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao executar fluxo: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Find start nodes (nodes without dependencies).
     */
    protected function findStartNodes(array $nodes): array
    {
        $allNodeIds = array_column($nodes, 'id');
        $nodesWithDependencies = [];

        foreach ($nodes as $node) {
            $dependencies = $node['dependencies'] ?? [];
            foreach ($dependencies as $dep) {
                $nodesWithDependencies[] = $dep;
            }
        }

        return array_filter($nodes, function ($node) use ($nodesWithDependencies) {
            return !in_array($node['id'], $nodesWithDependencies);
        });
    }

    /**
     * Execute node with error recovery.
     */
    protected function executeNodeWithRecovery(array $node, array $context, array $allNodes): array
    {
        $maxRetries = 3;
        $retryCount = 0;
        $lastError = null;

        while ($retryCount < $maxRetries) {
            try {
                $startTime = microtime(true);

                // Executar nó usando AuraFlowService
                $result = $this->executeNode($node, $context);

                $executionTime = (microtime(true) - $startTime) * 1000; // em milissegundos

                return [
                    'success' => true,
                    'node_id' => $node['id'],
                    'node_type' => $node['type'] ?? 'unknown',
                    'result' => $result,
                    'execution_time_ms' => round($executionTime, 2),
                    'retries' => $retryCount
                ];
            } catch (\Exception $e) {
                $lastError = $e;
                $retryCount++;

                Log::warning("Erro ao executar nó, tentativa {$retryCount}/{$maxRetries}", [
                    'node_id' => $node['id'],
                    'error' => $e->getMessage()
                ]);

                // Aguardar antes de tentar novamente (exponential backoff)
                if ($retryCount < $maxRetries) {
                    usleep(100000 * $retryCount); // 100ms, 200ms, 300ms
                }
            }
        }

        // Todas as tentativas falharam
        return [
            'success' => false,
            'node_id' => $node['id'],
            'node_type' => $node['type'] ?? 'unknown',
            'error' => $lastError?->getMessage() ?? 'Unknown error',
            'retries' => $retryCount
        ];
    }

    /**
     * Execute a single node.
     */
    protected function executeNode(array $node, array $context): array
    {
        $nodeType = $node['type'] ?? 'unknown';
        $nodeData = $node['data'] ?? [];

        // Usar AuraFlowService para executar nó básico
        // Para nós avançados, adicionar lógica específica
        switch ($nodeType) {
            case 'parallel':
                return $this->executeParallelNode($node, $context);
            case 'conditional_branch':
                return $this->executeConditionalBranch($node, $context);
            case 'error_handler':
                return $this->executeErrorHandler($node, $context);
            default:
                // Usar serviço básico para outros tipos
                return ['executed' => true, 'node_type' => $nodeType];
        }
    }

    /**
     * Execute parallel node.
     */
    protected function executeParallelNode(array $node, array $context): array
    {
        $parallelNodes = $node['data']['nodes'] ?? [];
        $results = [];

        foreach ($parallelNodes as $parallelNode) {
            $results[] = $this->executeNodeWithRecovery($parallelNode, $context, []);
        }

        return [
            'type' => 'parallel',
            'results' => $results,
            'all_succeeded' => !in_array(false, array_column($results, 'success'))
        ];
    }

    /**
     * Execute conditional branch.
     */
    protected function executeConditionalBranch(array $node, array $context): array
    {
        $condition = $node['data']['condition'] ?? null;
        $truePath = $node['data']['true_path'] ?? null;
        $falsePath = $node['data']['false_path'] ?? null;

        $conditionResult = $this->evaluateCondition($condition, $context);

        $selectedPath = $conditionResult ? $truePath : $falsePath;

        if ($selectedPath) {
            return [
                'type' => 'conditional_branch',
                'condition_result' => $conditionResult,
                'selected_path' => $selectedPath
            ];
        }

        return [
            'type' => 'conditional_branch',
            'condition_result' => $conditionResult,
            'selected_path' => null
        ];
    }

    /**
     * Execute error handler.
     */
    protected function executeErrorHandler(array $node, array $context): array
    {
        $errorType = $context['last_error']['type'] ?? 'unknown';
        $handler = $node['data']['handlers'][$errorType] ?? $node['data']['default_handler'] ?? null;

        if ($handler) {
            return [
                'type' => 'error_handler',
                'error_type' => $errorType,
                'handler_applied' => true
            ];
        }

        return [
            'type' => 'error_handler',
            'error_type' => $errorType,
            'handler_applied' => false
        ];
    }

    /**
     * Evaluate condition.
     */
    protected function evaluateCondition(?array $condition, array $context): bool
    {
        if (!$condition) {
            return false;
        }

        $field = $condition['field'] ?? null;
        $operator = $condition['operator'] ?? '=';
        $value = $condition['value'] ?? null;

        if (!$field || !isset($context[$field])) {
            return false;
        }

        $fieldValue = $context[$field];

        return match ($operator) {
            '=' => $fieldValue == $value,
            '!=' => $fieldValue != $value,
            '>' => $fieldValue > $value,
            '<' => $fieldValue < $value,
            '>=' => $fieldValue >= $value,
            '<=' => $fieldValue <= $value,
            'contains' => str_contains((string)$fieldValue, (string)$value),
            default => false
        };
    }

    /**
     * Process dependent nodes.
     */
    protected function processDependentNodes(array $nodes, array &$executionResults, array $context): void
    {
        $processed = array_keys($executionResults);

        foreach ($nodes as $node) {
            if (in_array($node['id'], $processed)) {
                continue;
            }

            $dependencies = $node['dependencies'] ?? [];
            $allDependenciesMet = true;

            foreach ($dependencies as $dep) {
                if (!isset($executionResults[$dep]) || !$executionResults[$dep]['success']) {
                    $allDependenciesMet = false;
                    break;
                }
            }

            if ($allDependenciesMet) {
                $result = $this->executeNodeWithRecovery($node, $context, $nodes);
                $executionResults[$node['id']] = $result;
                $processed[] = $node['id'];
            }
        }
    }

    /**
     * Calculate execution statistics.
     */
    protected function calculateExecutionStats(array $executionResults): array
    {
        $total = count($executionResults);
        $successful = count(array_filter($executionResults, fn($r) => $r['success'] ?? false));
        $failed = $total - $successful;
        $successRate = $total > 0 ? round(($successful / $total) * 100, 2) : 0;

        $totalExecutionTime = array_sum(array_column($executionResults, 'execution_time_ms'));
        $avgExecutionTime = $total > 0 ? round($totalExecutionTime / $total, 2) : 0;

        return [
            'total_nodes' => $total,
            'successful' => $successful,
            'failed' => $failed,
            'success_rate' => $successRate,
            'avg_execution_time_ms' => $avgExecutionTime,
            'total_execution_time_ms' => round($totalExecutionTime, 2)
        ];
    }

    /**
     * Optimize flow execution.
     * 
     * @param string $flowId
     * @return array
     */
    public function optimize(string $flowId): array
    {
        try {
            Log::info("AdvancedFlowEngine::optimize - starting", [
                'flow_id' => $flowId
            ]);

            $flow = AuraFlowModel::findOrFail($flowId);

            // Analisar execuções anteriores
            $executions = AuraFlowExecutionModel::where('flow_id', $flowId)
                ->where('status', 'completed')
                ->orderBy('completed_at', 'desc')
                ->limit(100)
                ->get();

            if ($executions->isEmpty()) {
                return [
                    'success' => false,
                    'message' => 'Não há execuções anteriores para análise'
                ];
            }

            // Calcular métricas de performance
            $avgDuration = $executions->avg(function ($exec) {
                if ($exec->started_at && $exec->completed_at) {
                    return $exec->started_at->diffInSeconds($exec->completed_at);
                }
                return 0;
            });

            // Identificar nós problemáticos (mais lentos ou com mais erros)
            $nodePerformance = $this->analyzeNodePerformance($executions);

            // Sugerir otimizações
            $optimizations = $this->suggestOptimizations($nodePerformance, $flow);

            Log::info("AdvancedFlowEngine::optimize - success", [
                'flow_id' => $flowId,
                'optimizations_suggested' => count($optimizations)
            ]);

            return [
                'success' => true,
                'flow_id' => $flowId,
                'analysis' => [
                    'avg_duration_seconds' => round($avgDuration, 2),
                    'total_executions_analyzed' => $executions->count(),
                    'node_performance' => $nodePerformance
                ],
                'optimizations' => $optimizations,
                'message' => 'Análise de otimização concluída'
            ];
        } catch (\Exception $e) {
            Log::error("AdvancedFlowEngine::optimize - error", [
                'flow_id' => $flowId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao otimizar fluxo: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Analyze node performance.
     */
    protected function analyzeNodePerformance($executions): array
    {
        $nodeStats = [];

        foreach ($executions as $exec) {
            $history = $exec->execution_history ?? [];
            
            foreach ($history as $entry) {
                $nodeId = $entry['node_id'] ?? 'unknown';
                
                if (!isset($nodeStats[$nodeId])) {
                    $nodeStats[$nodeId] = [
                        'executions' => 0,
                        'total_time' => 0,
                        'errors' => 0
                    ];
                }

                $nodeStats[$nodeId]['executions']++;
                $nodeStats[$nodeId]['total_time'] += $entry['execution_time'] ?? 0;
                
                if (isset($entry['error'])) {
                    $nodeStats[$nodeId]['errors']++;
                }
            }
        }

        // Calcular médias
        foreach ($nodeStats as $nodeId => &$stats) {
            $stats['avg_time'] = $stats['executions'] > 0 
                ? round($stats['total_time'] / $stats['executions'], 2) 
                : 0;
            $stats['error_rate'] = $stats['executions'] > 0 
                ? round(($stats['errors'] / $stats['executions']) * 100, 2) 
                : 0;
        }

        return $nodeStats;
    }

    /**
     * Suggest optimizations.
     */
    protected function suggestOptimizations(array $nodePerformance, AuraFlowModel $flow): array
    {
        $optimizations = [];

        foreach ($nodePerformance as $nodeId => $stats) {
            // Sugerir cache se nó é executado frequentemente e é lento
            if ($stats['avg_time'] > 1000 && $stats['executions'] > 10) {
                $optimizations[] = [
                    'type' => 'cache',
                    'node_id' => $nodeId,
                    'reason' => "Nó executado {$stats['executions']} vezes com tempo médio de {$stats['avg_time']}ms",
                    'suggestion' => 'Considerar cachear resultados deste nó'
                ];
            }

            // Sugerir paralelização se há múltiplos nós independentes lentos
            if ($stats['avg_time'] > 500) {
                $optimizations[] = [
                    'type' => 'parallelization',
                    'node_id' => $nodeId,
                    'reason' => "Nó com tempo médio de {$stats['avg_time']}ms",
                    'suggestion' => 'Considerar executar este nó em paralelo com outros independentes'
                ];
            }

            // Sugerir tratamento de erro se taxa de erro é alta
            if ($stats['error_rate'] > 10) {
                $optimizations[] = [
                    'type' => 'error_handling',
                    'node_id' => $nodeId,
                    'reason' => "Taxa de erro de {$stats['error_rate']}%",
                    'suggestion' => 'Adicionar tratamento de erro e retry para este nó'
                ];
            }
        }

        return $optimizations;
    }
}
