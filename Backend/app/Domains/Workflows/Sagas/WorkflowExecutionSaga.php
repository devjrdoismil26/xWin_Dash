<?php

namespace App\Domains\Workflows\Sagas;

use App\Domains\Workflows\Events\WorkflowCompleted;
use App\Domains\Workflows\Events\WorkflowFailed;
use App\Domains\Workflows\Services\WorkflowExecutionService;
use App\Domains\Workflows\Services\WorkflowService;
use App\Domains\Workflows\Executors\WorkflowNodeExecutorFactory;
use App\Shared\Transactions\Saga;
use Illuminate\Support\Facades\Log;

class WorkflowExecutionSaga implements Saga
{
    protected WorkflowExecutionService $workflowExecutionService;

    protected WorkflowService $workflowService;

    protected WorkflowNodeExecutorFactory $executorFactory;

    /**
     * @var array<string, mixed>
     */
    protected array $context; // Contexto da execução da saga

    public function __construct(
        WorkflowExecutionService $workflowExecutionService,
        WorkflowService $workflowService,
        WorkflowNodeExecutorFactory $executorFactory
    ) {
        $this->workflowExecutionService = $workflowExecutionService;
        $this->workflowService = $workflowService;
        $this->executorFactory = $executorFactory;
    }

    /**
     * Inicia a execução da saga.
     *
     * @param array<string, mixed> $data dados iniciais para a saga (ex: workflow_id, initial_payload)
     *
     * @return mixed o resultado final da execução do workflow
     *
     * @throws \Exception se a execução do workflow falhar
     */
    public function start(array $data)
    {
        $workflowId = $data['workflow_id'];
        $initialPayload = $data['initial_payload'] ?? [];

        Log::info("Iniciando WorkflowExecutionSaga para workflow ID: {$workflowId}.");

        // Criar um registro de execução de workflow
        $execution = $this->workflowExecutionService->createExecution($workflowId, $initialPayload);
        $this->context = ['execution_id' => $execution->id, 'workflow_id' => $workflowId, 'payload' => $initialPayload];

        try {
            // Obter a definição do workflow
            $workflowDefinition = $this->workflowService->getWorkflowDefinition($workflowId);

            // Executar o workflow passo a passo
            $currentNode = 'start';
            $result = null;

            while ($currentNode !== 'end') {
                if (!isset($workflowDefinition[$currentNode])) {
                    throw new \Exception("Nó de workflow desconhecido: {$currentNode}");
                }

                $nodeConfig = $workflowDefinition[$currentNode];
                $action = $nodeConfig['action'];
                $parameters = $nodeConfig['parameters'] ?? [];

                Log::info("Executando nó '{$currentNode}' com ação '{$action}'.");

                // Simulação de execução de nó (em um cenário real, chamaria executores de nó)
                $nodeResult = $this->executeNodeAction($action, $parameters, $this->context['payload']);

                // Atualizar o payload para o próximo nó
                $this->context['payload'] = array_merge($this->context['payload'], $nodeResult);

                // Determinar o próximo nó
                if (isset($nodeConfig['condition'])) {
                    $conditionResult = $this->evaluateNodeCondition($nodeConfig['condition'], $this->context['payload']);
                    $currentNode = $conditionResult ? $nodeConfig['true'] : $nodeConfig['false'];
                } else {
                    $currentNode = $nodeConfig['next'] ?? 'end';
                }

                // Atualizar o estado da execução da saga
                $this->workflowExecutionService->updateExecutionStatus($execution->id, 'in_progress', ['current_node' => $currentNode]);
            }

            $this->workflowExecutionService->updateExecutionStatus($execution->id, 'completed');
            WorkflowCompleted::dispatch($execution); // Disparar evento de conclusão
            Log::info("WorkflowExecutionSaga para workflow ID: {$workflowId} concluída com sucesso.");
            return $this->context['payload'];
        } catch (\Throwable $e) {
            $this->workflowExecutionService->updateExecutionStatus($execution->id, 'failed', ['error' => $e->getMessage()]);
            WorkflowFailed::dispatch($execution, $e->getMessage()); // Disparar evento de falha
            Log::error("WorkflowExecutionSaga para workflow ID: {$workflowId} falhou. Erro: " . $e->getMessage());
            $this->compensate($currentNode, $this->context); // Chamar compensação
            throw $e;
        }
    }

    /**
     * Continua a execução da saga a partir de um determinado estado.
     *
     * @param string $state o estado atual da saga
     * @param array<string, mixed> $data dados para continuar a saga
     *
     * @return mixed o resultado da saga
     */
    public function continue(string $state, array $data)
    {
        // Lógica para continuar a saga de um ponto específico (para sagas de longa duração)
        Log::info("Continuando WorkflowExecutionSaga do estado: {$state}.");
        // Implementação mais complexa para sagas assíncronas
        return null;
    }

    /**
     * Reverte as operações da saga em caso de falha.
     *
     * @param string $failedState o estado em que a saga falhou
     * @param array<string, mixed> $data dados para compensação
     *
     * @return bool true se a compensação for bem-sucedida
     */
    public function compensate(string $failedState, array $data): bool
    {
        Log::warning("Iniciando compensação para WorkflowExecutionSaga no estado: {$failedState}.");
        // Lógica de compensação baseada no estado que falhou
        // Exemplo: se um nó de criação de recurso falhou, tentar deletar o recurso criado
        return true;
    }

    /**
     * Executa uma ação de nó de workflow usando executores reais.
     *
     * @param string $action
     * @param array  $parameters
     * @param array  $currentPayload
     *
     * @return array
     */
    protected function executeNodeAction(string $action, array $parameters, array $currentPayload): array
    {
        Log::info("Executando ação de nó: {$action}");

        try {
            // Construir configuração do nó para o executor
            $nodeConfig = [
                'type' => $action,
                'config' => $parameters
            ];

            // Obter o executor apropriado
            $executor = $this->executorFactory->createExecutor($action);

            // Executar o nó
            $result = $executor->execute($nodeConfig, $currentPayload);

            Log::info("Ação de nó '{$action}' executada com sucesso");
            return $result;
        } catch (\Exception $e) {
            Log::error("Erro ao executar ação de nó '{$action}': " . $e->getMessage());

            // Retornar payload original com erro registrado
            $currentPayload['_errors'] = $currentPayload['_errors'] ?? [];
            $currentPayload['_errors'][] = [
                'node_action' => $action,
                'error' => $e->getMessage(),
                'timestamp' => now()->toISOString()
            ];

            return $currentPayload;
        }
    }

    /**
     * Avalia uma condição de nó de workflow.
     *
     * @param string $condition
     * @param array  $currentPayload
     *
     * @return bool
     */
    protected function evaluateNodeCondition(string $condition, array $currentPayload): bool
    {
        Log::info("Avaliando condição de nó: {$condition}");

        try {
            // Avaliar expressões simples
            return $this->evaluateSimpleCondition($condition, $currentPayload);
        } catch (\Exception $e) {
            Log::error("Erro ao avaliar condição '{$condition}': " . $e->getMessage());
            return false;
        }
    }

    /**
     * Avalia condições simples baseadas no payload.
     */
    protected function evaluateSimpleCondition(string $condition, array $payload): bool
    {
        // Substituir variáveis do payload na condição
        $evaluatedCondition = $this->replacePayloadVariables($condition, $payload);

        // Avaliar expressões básicas de forma segura
        if (preg_match('/^[a-zA-Z0-9_\s\'"==!=<>()]+$/', $evaluatedCondition)) {
            // Avaliar apenas expressões "seguras"
            $operators = ['==', '!=', '>', '<', '>=', '<='];

            foreach ($operators as $operator) {
                if (strpos($evaluatedCondition, $operator) !== false) {
                    $parts = explode($operator, $evaluatedCondition, 2);
                    if (count($parts) === 2) {
                        $left = trim($parts[0], " '\"");
                        $right = trim($parts[1], " '\"");

                        return $this->compareValues($left, $right, $operator);
                    }
                }
            }
        }

        // Se não conseguir avaliar, verificar se é uma chave booleana do payload
        $trimmedCondition = trim($condition);
        if (isset($payload[$trimmedCondition])) {
            return (bool) $payload[$trimmedCondition];
        }

        // Fallback: sempre verdadeiro para condições não reconhecidas
        Log::warning("Condição não reconhecida, retornando true: {$condition}");
        return true;
    }

    /**
     * Substitui variáveis do payload na condição.
     */
    protected function replacePayloadVariables(string $condition, array $payload): string
    {
        // Substituir {{variable}} por valores do payload
        return preg_replace_callback('/\{\{([^}]+)\}\}/', function ($matches) use ($payload) {
            $key = trim($matches[1]);
            return isset($payload[$key]) ? (string) $payload[$key] : '';
        }, $condition);
    }

    /**
     * Compara valores usando um operador.
     */
    protected function compareValues(string $left, string $right, string $operator): bool
    {
        // Tentar converter para números se possível
        $leftNum = is_numeric($left) ? (float) $left : $left;
        $rightNum = is_numeric($right) ? (float) $right : $right;

        switch ($operator) {
            case '==':
                return $leftNum == $rightNum;
            case '!=':
                return $leftNum != $rightNum;
            case '>':
                return $leftNum > $rightNum;
            case '<':
                return $leftNum < $rightNum;
            case '>=':
                return $leftNum >= $rightNum;
            case '<=':
                return $leftNum <= $rightNum;
            default:
                return false;
        }
    }
}
