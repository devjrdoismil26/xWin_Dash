<?php

namespace App\Domains\Workflows\Sagas;

use App\Domains\Leads\Domain\Lead;
use App\Domains\Workflows\Services\WorkflowExecutionService;
use App\Domains\Workflows\Services\WorkflowService;
use App\Domains\Workflows\Factories\WorkflowNodeExecutorFactory;
use App\Shared\Transactions\Saga;
use Illuminate\Support\Facades\Log;

class LeadWorkflowSaga implements Saga
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
     * Inicia a execução da saga para um Lead.
     *
     * @param array<string, mixed> $data dados iniciais para a saga
     *
     * @return mixed o resultado final da execução do workflow
     *
     * @throws \Exception se a execução do workflow falhar
     */
    public function start(array $data)
    {
        $lead = $data['lead'] ?? null;
        $workflowType = $data['workflow_type'] ?? '';
        $initialPayload = $data['initial_payload'] ?? [];

        Log::info("Iniciando LeadWorkflowSaga para Lead ID: {$lead->id}, tipo: {$workflowType}.");

        $execution = $this->initializeExecution($lead, $initialPayload);
        $this->initializeContext($execution, $lead, $workflowType, $initialPayload);

        try {
            $workflowDefinition = $this->getWorkflowDefinition($workflowType);
            $this->executeWorkflowSteps($workflowDefinition, $lead, $execution);
            
            $this->completeExecution($execution, $lead);
            return $this->context['payload'];
        } catch (\Throwable $e) {
            $this->handleExecutionFailure($execution, $e, $lead);
            throw $e;
        }
    }

    /**
     * Inicializa a execução do workflow.
     *
     * @param Lead $lead
     * @param array<string, mixed> $initialPayload
     * @return mixed
     */
    private function initializeExecution(Lead $lead, array $initialPayload)
    {
        return $this->workflowExecutionService->createExecution($lead->id, $initialPayload);
    }

    /**
     * Inicializa o contexto da saga.
     *
     * @param mixed $execution
     * @param Lead $lead
     * @param string $workflowType
     * @param array<string, mixed> $initialPayload
     */
    private function initializeContext($execution, Lead $lead, string $workflowType, array $initialPayload): void
    {
        $this->context = [
            'execution_id' => $execution->id,
            'lead_id' => $lead->id,
            'workflow_type' => $workflowType,
            'payload' => $initialPayload
        ];
    }

    /**
     * Obtém a definição do workflow.
     *
     * @param string $workflowType
     * @return mixed
     */
    private function getWorkflowDefinition(string $workflowType)
    {
        return $this->workflowService->getWorkflowById($workflowType);
    }

    /**
     * Executa os passos do workflow.
     *
     * @param mixed $workflowDefinition
     * @param Lead $lead
     * @param mixed $execution
     * @throws \Exception
     */
    private function executeWorkflowSteps($workflowDefinition, Lead $lead, $execution): void
    {
        $currentNode = 'start';

        while ($currentNode !== 'end') {
            $currentNode = $this->executeSingleNode($workflowDefinition, $currentNode, $lead, $execution);
        }
    }

    /**
     * Executa um único nó do workflow.
     *
     * @param mixed $workflowDefinition
     * @param string $currentNode
     * @param Lead $lead
     * @param mixed $execution
     * @return string
     * @throws \Exception
     */
    private function executeSingleNode($workflowDefinition, string $currentNode, Lead $lead, $execution): string
    {
        $this->validateNodeExists($workflowDefinition, $currentNode);
        
        $nodeConfig = $workflowDefinition[$currentNode];
        $action = $nodeConfig['action'];
        $parameters = $nodeConfig['parameters'] ?? [];

        Log::info("Executando nó '{$currentNode}' com ação '{$action}' para Lead ID: {$lead->id}.");

        $nodeResult = $this->executeNodeAction($action, $parameters, $this->context['payload'], $lead);
        $this->context['payload'] = array_merge($this->context['payload'], $nodeResult);

        $nextNode = $this->determineNextNode($nodeConfig);
        $this->updateExecutionStatus($execution, $nextNode);

        return $nextNode;
    }

    /**
     * Valida se o nó existe na definição do workflow.
     *
     * @param mixed $workflowDefinition
     * @param string $currentNode
     * @throws \Exception
     */
    private function validateNodeExists($workflowDefinition, string $currentNode): void
    {
        if (!isset($workflowDefinition->definition['nodes'][$currentNode])) {
            throw new \Exception("Nó de workflow de Lead desconhecido: {$currentNode}");
        }
    }

    /**
     * Determina o próximo nó baseado na configuração.
     *
     * @param array<string, mixed> $nodeConfig
     * @return string
     */
    private function determineNextNode(array $nodeConfig): string
    {
        if (isset($nodeConfig['condition'])) {
            $conditionResult = $this->evaluateNodeCondition($nodeConfig['condition'], $this->context['payload'], $this->context['lead_id']);
            return $conditionResult ? $nodeConfig['true'] : $nodeConfig['false'];
        }

        return $nodeConfig['next'] ?? 'end';
    }

    /**
     * Atualiza o status da execução.
     *
     * @param mixed $execution
     * @param string $currentNode
     */
    private function updateExecutionStatus($execution, string $currentNode): void
    {
        $this->workflowExecutionService->updateExecutionStatus($execution->id, 'in_progress', ['current_node' => $currentNode]);
    }

    /**
     * Completa a execução com sucesso.
     *
     * @param mixed $execution
     * @param Lead $lead
     */
    private function completeExecution($execution, Lead $lead): void
    {
        $this->workflowExecutionService->updateExecutionStatus($execution->id, 'completed');
        Log::info("LeadWorkflowSaga para Lead ID: {$lead->id} concluída com sucesso.");
    }

    /**
     * Trata falhas na execução.
     *
     * @param mixed $execution
     * @param \Throwable $e
     * @param Lead $lead
     */
    private function handleExecutionFailure($execution, \Throwable $e, Lead $lead): void
    {
        $this->workflowExecutionService->updateExecutionStatus($execution->id, 'failed', ['error' => $e->getMessage()]);
        Log::error("LeadWorkflowSaga para Lead ID: {$lead->id} falhou. Erro: " . $e->getMessage());
        $this->compensate('unknown', $this->context);
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
        Log::info("Continuando LeadWorkflowSaga do estado: {$state}.");
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
        Log::warning("Iniciando compensação para LeadWorkflowSaga no estado: {$failedState}.");
        // Lógica de compensação baseada no estado que falhou
        return true;
    }

    /**
     * Executa uma ação de nó de workflow para um Lead usando executors reais.
     *
     * @param string $action
     * @param array<string, mixed> $parameters
     * @param array<string, mixed> $currentPayload
     * @param Lead $lead
     *
     * @return array<string, mixed>
     */
    protected function executeNodeAction(string $action, array $parameters, array $currentPayload, Lead $lead): array
    {
        Log::info("Executando ação de nó para Lead ID: {$lead->id}: {$action}");

        try {
            // Obter o executor específico para a ação
            $executor = $this->executorFactory->create($action);

            // Criar objetos necessários para o executor
            $mockNode = (object) [
                'id' => uniqid('node_'),
                'type' => $action,
                'configuration' => $parameters,
            ];

            $mockContext = (object) [
                'payload' => $currentPayload,
                'lead_id' => $lead->id,
            ];

            // Executar usando o padrão real dos executors
            $result = $executor->execute($mockNode, $lead, $mockContext);

            // Adaptar resultado para array
            if (is_array($result)) {
                return $result;
            } else {
                return ['action_result' => $result, 'action' => $action];
            }
        } catch (\Exception $e) {
            Log::error("Erro ao executar ação {$action} para Lead {$lead->id}: " . $e->getMessage());
            return ['action_result' => 'failed', 'error' => $e->getMessage()];
        }
    }

    /**
     * Avalia uma condição de nó de workflow para um Lead.
     *
     * @param string $condition
     * @param array<string, mixed> $currentPayload
     * @param Lead $lead
     *
     * @return bool
     */
    protected function evaluateNodeCondition(string $condition, array $currentPayload, Lead $lead): bool
    {
        Log::info("Avaliando condição de nó para Lead ID: {$lead->id}: {$condition}");

        try {
            // Condições simples baseadas em payload e propriedades do lead
            switch ($condition) {
                case 'lead_is_new':
                    return isset($lead->created_at) &&
                           $lead->created_at > now()->subDays(1);

                case 'lead_has_email':
                    return !empty($lead->email);

                case 'lead_has_phone':
                    return !empty($lead->phone);

                case 'payload_has_value':
                    return !empty($currentPayload);

                case 'lead_score_high':
                    return ($lead->score ?? 0) > 70;

                default:
                    // Para condições mais complexas, usar um avaliador de expressões
                    return $this->evaluateExpression($condition, $currentPayload, $lead);
            }
        } catch (\Exception $e) {
            Log::error("Erro ao avaliar condição {$condition} para Lead {$lead->id}: " . $e->getMessage());
            return false; // Falso em caso de erro
        }
    }

    /**
     * Avalia expressões mais complexas.
     */
    protected function evaluateExpression(string $expression, array $payload, Lead $lead): bool
    {
        // Implementação simples para expressões básicas
        // Em produção, usar biblioteca como Symfony ExpressionLanguage

        // Substituir variáveis na expressão
        $expression = str_replace([
            '{lead.id}',
            '{lead.email}',
            '{lead.score}',
            '{payload.count}',
        ], [
            $lead->id ?? 0,
            "'{$lead->email}'",
            $lead->score ?? 0,
            count($payload),
        ], $expression);

        // Avaliar expressões seguras
        if (preg_match('/^[\d\s\+\-\*\/\(\)\>\<\=\!]+$/', $expression)) {
            try {
                return (bool) eval("return {$expression};");
            } catch (\Exception $e) {
                Log::warning("Erro ao avaliar expressão: {$expression}");
                return false;
            }
        }

        Log::warning("Expressão não segura ignorada: {$expression}");
        return false;
    }
}
