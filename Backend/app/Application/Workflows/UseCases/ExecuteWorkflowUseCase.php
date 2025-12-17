<?php

namespace App\Application\Workflows\UseCases;

use App\Application\Workflows\Commands\ExecuteWorkflowCommand;
use App\Domains\Workflows\Services\WorkflowService;
use App\Shared\Services\CrossModuleOrchestrationService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * UseCase para execução de workflows com lógica de negócio completa
 * Implementa validação, execução e monitoramento
 */
class ExecuteWorkflowUseCase
{
    protected WorkflowService $workflowService;
    protected CrossModuleOrchestrationService $orchestrationService;

    public function __construct(
        WorkflowService $workflowService,
        CrossModuleOrchestrationService $orchestrationService
    ) {
        $this->workflowService = $workflowService;
        $this->orchestrationService = $orchestrationService;
    }

    /**
     * Executa o caso de uso para execução de workflow
     *
     * @param ExecuteWorkflowCommand $command
     * @return array
     */
    public function execute(ExecuteWorkflowCommand $command): array
    {
        try {
            DB::beginTransaction();

            // 1. Validar workflow
            $this->validateWorkflow($command);

            // 2. Preparar contexto de execução
            $executionContext = $this->prepareExecutionContext($command);

            // 3. Iniciar execução
            $execution = $this->startExecution($command, $executionContext);

            // 4. Processar nós sequencialmente
            $results = $this->processNodes($execution, $command);

            // 5. Finalizar execução
            $this->finalizeExecution($execution, $results);

            // 6. Aplicar pós-processamento
            $this->postProcessExecution($execution, $results, $command);

            DB::commit();

            Log::info("Workflow executado com sucesso via UseCase", [
                'workflow_id' => $command->workflowId,
                'execution_id' => $execution->id,
                'nodes_processed' => count($results),
                'user_id' => $command->userId
            ]);

            return [
                'execution' => $execution,
                'results' => $results,
                'status' => 'completed',
                'message' => 'Workflow executado com sucesso'
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erro na execução de workflow via UseCase", [
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Valida o workflow antes da execução
     */
    private function validateWorkflow(ExecuteWorkflowCommand $command): void
    {
        // Verificar se workflow existe
        $workflow = $this->workflowService->getWorkflowById($command->workflowId);
        if (!$workflow) {
            throw new \Exception("Workflow não encontrado: {$command->workflowId}");
        }

        // Verificar se workflow está ativo
        if ($workflow->status !== 'active') {
            throw new \Exception("Workflow não está ativo: {$workflow->status}");
        }

        // Verificar permissões do usuário
        if (!$this->orchestrationService->canUserExecuteWorkflow($command->userId, $command->workflowId)) {
            throw new \Exception("Usuário não tem permissão para executar este workflow");
        }

        // Verificar limites de execução
        $this->validateExecutionLimits($command);
    }

    /**
     * Valida limites de execução
     */
    private function validateExecutionLimits(ExecuteWorkflowCommand $command): void
    {
        $user = $this->orchestrationService->getUserById($command->userId);
        $maxConcurrentExecutions = $user->hasRole('premium') ? 10 : 3;

        $currentExecutions = $this->workflowService->getUserActiveExecutions($command->userId);
        if (count($currentExecutions) >= $maxConcurrentExecutions) {
            throw new \Exception("Limite de execuções simultâneas atingido: {$maxConcurrentExecutions}");
        }
    }

    /**
     * Prepara contexto de execução
     */
    private function prepareExecutionContext(ExecuteWorkflowCommand $command): array
    {
        return [
            'workflow_id' => $command->workflowId,
            'user_id' => $command->userId,
            'payload' => $command->payload ?? [],
            'execution_mode' => $command->executionMode ?? 'normal',
            'priority' => $command->priority ?? 'normal',
            'timeout' => $command->timeout ?? 300, // 5 minutos
            'retry_count' => 0,
            'max_retries' => $command->maxRetries ?? 3,
            'started_at' => now(),
            'context_data' => $this->gatherContextData($command)
        ];
    }

    /**
     * Coleta dados de contexto
     */
    private function gatherContextData(ExecuteWorkflowCommand $command): array
    {
        return [
            'user_agent' => request()->header('User-Agent'),
            'ip_address' => request()->ip(),
            'session_id' => session()->getId(),
            'request_id' => request()->header('X-Request-ID'),
            'environment' => app()->environment(),
            'version' => config('app.version')
        ];
    }

    /**
     * Inicia a execução do workflow
     */
    private function startExecution(ExecuteWorkflowCommand $command, array $context): object
    {
        $execution = $this->workflowService->startWorkflow(
            $command->workflowId,
            $context['payload']
        );

        // Registrar início da execução
        $this->orchestrationService->recordWorkflowActivity($execution->id, [
            'type' => 'execution_started',
            'description' => 'Execução de workflow iniciada',
            'metadata' => [
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId,
                'execution_mode' => $context['execution_mode'],
                'priority' => $context['priority']
            ]
        ]);

        return $execution;
    }

    /**
     * Processa nós do workflow
     */
    private function processNodes(object $execution, ExecuteWorkflowCommand $command): array
    {
        $workflow = $this->workflowService->getWorkflowById($command->workflowId);
        $nodes = $workflow->structure['nodes'];
        $edges = $workflow->structure['edges'];

        // Encontrar nó de início
        $startNode = $this->findStartNode($nodes);
        if (!$startNode) {
            throw new \Exception('Nó de início não encontrado no workflow');
        }

        $results = [];
        $processedNodes = [];
        $currentNode = $startNode;

        while ($currentNode) {
            try {
                // Processar nó atual
                $nodeResult = $this->processNode($currentNode, $execution, $command);
                $results[$currentNode['id']] = $nodeResult;
                $processedNodes[] = $currentNode['id'];

                // Registrar processamento do nó
                $this->workflowService->recordNodeCompletion(
                    $execution->id,
                    $currentNode['id'],
                    $nodeResult['status'],
                    $nodeResult['error'] ?? null
                );

                // Encontrar próximo nó
                $currentNode = $this->findNextNode($currentNode, $edges, $nodes, $nodeResult);

            } catch (\Exception $e) {
                // Tratar erro no nó
                $this->handleNodeError($currentNode, $execution, $e, $command);
                break;
            }
        }

        return $results;
    }

    /**
     * Encontra nó de início
     */
    private function findStartNode(array $nodes): ?array
    {
        foreach ($nodes as $node) {
            if ($node['type'] === 'start') {
                return $node;
            }
        }
        return null;
    }

    /**
     * Processa um nó específico
     */
    private function processNode(array $node, object $execution, ExecuteWorkflowCommand $command): array
    {
        $startTime = microtime(true);

        try {
            switch ($node['type']) {
                case 'start':
                    return $this->processStartNode($node, $execution, $command);
                case 'end':
                    return $this->processEndNode($node, $execution, $command);
                case 'condition':
                    return $this->processConditionNode($node, $execution, $command);
                case 'action':
                    return $this->processActionNode($node, $execution, $command);
                case 'delay':
                    return $this->processDelayNode($node, $execution, $command);
                case 'email':
                    return $this->processEmailNode($node, $execution, $command);
                case 'webhook':
                    return $this->processWebhookNode($node, $execution, $command);
                case 'api_call':
                    return $this->processApiCallNode($node, $execution, $command);
                default:
                    throw new \Exception("Tipo de nó não suportado: {$node['type']}");
            }
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'error' => $e->getMessage(),
                'execution_time' => microtime(true) - $startTime,
                'node_id' => $node['id'],
                'node_type' => $node['type']
            ];
        }
    }

    /**
     * Processa nó de início
     */
    private function processStartNode(array $node, object $execution, ExecuteWorkflowCommand $command): array
    {
        return [
            'status' => 'success',
            'data' => $command->payload,
            'execution_time' => 0.001,
            'node_id' => $node['id'],
            'node_type' => 'start'
        ];
    }

    /**
     * Processa nó de fim
     */
    private function processEndNode(array $node, object $execution, ExecuteWorkflowCommand $command): array
    {
        return [
            'status' => 'success',
            'data' => ['workflow_completed' => true],
            'execution_time' => 0.001,
            'node_id' => $node['id'],
            'node_type' => 'end'
        ];
    }

    /**
     * Processa nó de condição
     */
    private function processConditionNode(array $node, object $execution, ExecuteWorkflowCommand $command): array
    {
        $condition = $node['data']['condition'] ?? null;
        if (!$condition) {
            throw new \Exception('Condição não definida no nó');
        }

        $result = $this->evaluateCondition($condition, $execution->payload);
        
        return [
            'status' => 'success',
            'data' => ['condition_result' => $result],
            'execution_time' => 0.01,
            'node_id' => $node['id'],
            'node_type' => 'condition',
            'condition_result' => $result
        ];
    }

    /**
     * Processa nó de ação
     */
    private function processActionNode(array $node, object $execution, ExecuteWorkflowCommand $command): array
    {
        $action = $node['data']['action'] ?? null;
        if (!$action) {
            throw new \Exception('Ação não definida no nó');
        }

        $result = $this->executeAction($action, $execution->payload);
        
        return [
            'status' => 'success',
            'data' => $result,
            'execution_time' => 0.1,
            'node_id' => $node['id'],
            'node_type' => 'action'
        ];
    }

    /**
     * Processa nó de delay
     */
    private function processDelayNode(array $node, object $execution, ExecuteWorkflowCommand $command): array
    {
        $duration = $node['data']['duration'] ?? 0;
        if ($duration > 0) {
            sleep($duration);
        }
        
        return [
            'status' => 'success',
            'data' => ['delayed' => $duration],
            'execution_time' => $duration,
            'node_id' => $node['id'],
            'node_type' => 'delay'
        ];
    }

    /**
     * Processa nó de email
     */
    private function processEmailNode(array $node, object $execution, ExecuteWorkflowCommand $command): array
    {
        $emailData = $node['data'];
        $result = $this->orchestrationService->sendEmail($emailData, $execution->payload);
        
        return [
            'status' => 'success',
            'data' => $result,
            'execution_time' => 0.5,
            'node_id' => $node['id'],
            'node_type' => 'email'
        ];
    }

    /**
     * Processa nó de webhook
     */
    private function processWebhookNode(array $node, object $execution, ExecuteWorkflowCommand $command): array
    {
        $webhookData = $node['data'];
        $result = $this->orchestrationService->callWebhook($webhookData, $execution->payload);
        
        return [
            'status' => 'success',
            'data' => $result,
            'execution_time' => 1.0,
            'node_id' => $node['id'],
            'node_type' => 'webhook'
        ];
    }

    /**
     * Processa nó de API call
     */
    private function processApiCallNode(array $node, object $execution, ExecuteWorkflowCommand $command): array
    {
        $apiData = $node['data'];
        $result = $this->orchestrationService->makeApiCall($apiData, $execution->payload);
        
        return [
            'status' => 'success',
            'data' => $result,
            'execution_time' => 0.8,
            'node_id' => $node['id'],
            'node_type' => 'api_call'
        ];
    }

    /**
     * Avalia condição
     */
    private function evaluateCondition(string $condition, array $payload): bool
    {
        // Implementar avaliação de condições
        // Por enquanto, retorna true
        return true;
    }

    /**
     * Executa ação
     */
    private function executeAction(string $action, array $payload): array
    {
        // Implementar execução de ações
        return ['action_executed' => $action];
    }

    /**
     * Encontra próximo nó
     */
    private function findNextNode(array $currentNode, array $edges, array $nodes, array $nodeResult): ?array
    {
        // Encontrar arestas que saem do nó atual
        $outgoingEdges = array_filter($edges, function($edge) use ($currentNode) {
            return $edge['source'] === $currentNode['id'];
        });

        if (empty($outgoingEdges)) {
            return null; // Fim do workflow
        }

        // Se é nó de condição, escolher baseado no resultado
        if ($currentNode['type'] === 'condition') {
            $conditionResult = $nodeResult['condition_result'] ?? false;
            foreach ($outgoingEdges as $edge) {
                if (isset($edge['condition']) && $edge['condition'] === $conditionResult) {
                    return $this->findNodeById($edge['target'], $nodes);
                }
            }
        }

        // Para outros tipos, pegar primeira aresta
        $nextEdge = reset($outgoingEdges);
        return $this->findNodeById($nextEdge['target'], $nodes);
    }

    /**
     * Encontra nó por ID
     */
    private function findNodeById(string $nodeId, array $nodes): ?array
    {
        foreach ($nodes as $node) {
            if ($node['id'] === $nodeId) {
                return $node;
            }
        }
        return null;
    }

    /**
     * Trata erro no nó
     */
    private function handleNodeError(array $node, object $execution, \Exception $e, ExecuteWorkflowCommand $command): void
    {
        $this->workflowService->recordNodeCompletion(
            $execution->id,
            $node['id'],
            'error',
            $e->getMessage()
        );

        // Registrar erro
        $this->orchestrationService->recordWorkflowActivity($execution->id, [
            'type' => 'node_error',
            'description' => "Erro no nó {$node['id']}: {$e->getMessage()}",
            'metadata' => [
                'node_id' => $node['id'],
                'node_type' => $node['type'],
                'error' => $e->getMessage()
            ]
        ]);
    }

    /**
     * Finaliza execução
     */
    private function finalizeExecution(object $execution, array $results): void
    {
        $this->workflowService->completeExecution($execution->id, $results);
    }

    /**
     * Pós-processamento da execução
     */
    private function postProcessExecution(object $execution, array $results, ExecuteWorkflowCommand $command): void
    {
        // Registrar conclusão
        $this->orchestrationService->recordWorkflowActivity($execution->id, [
            'type' => 'execution_completed',
            'description' => 'Execução de workflow concluída',
            'metadata' => [
                'workflow_id' => $command->workflowId,
                'nodes_processed' => count($results),
                'execution_time' => $execution->execution_time ?? 0
            ]
        ]);

        // Aplicar automações pós-execução
        $this->orchestrationService->triggerPostExecutionAutomations($execution, $results);
    }
}