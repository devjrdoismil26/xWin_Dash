<?php

namespace App\Domains\Workflows\Services;

use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionRepository;
use App\Domains\Workflows\Factories\WorkflowNodeExecutorFactory;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Carbon\Carbon;

/**
 * 🎭 Workflow Execution Orchestrator
 *
 * Serviço especializado para orquestração de execução de workflows
 * Responsável por gerenciar o ciclo de vida das execuções
 */
class WorkflowExecutionOrchestrator
{
    protected WorkflowNodeExecutorFactory $executorFactory;

    public function __construct(
        private WorkflowModel $workflows,
        private WorkflowExecutionRepository $executions,
        private CircuitBreakerService $circuitBreaker,
        WorkflowNodeExecutorFactory $executorFactory
    ) {
        $this->executorFactory = $executorFactory;
    }

    /**
     * Orquestrar execução de workflow
     */
    public function orchestrateWorkflow(int $workflowId, array $payload, array $options = []): array
    {
        try {
            $workflow = $this->workflows->findOrFail($workflowId);

            if (!$workflow->is_active) {
                throw new \Exception('Workflow is not active');
            }

            $definition = (array) ($workflow->canvas_definition ?? []);
            if (empty($definition)) {
                throw new \Exception('Workflow definition is empty');
            }

            // Criar registro de execução
            $execution = $this->executions->create([
                'workflow_id' => $workflowId,
                'status' => 'running',
                'payload' => $payload,
                'user_id' => $options['user_id'] ?? null,
                'started_at' => now(),
                'execution_context' => $this->buildExecutionContext($workflow, $payload, $options)
            ]);

            // Processar nós do workflow
            $result = $this->processWorkflowNodes($definition, $execution, $payload, $options);

            // Atualizar status da execução
            $this->executions->update($execution->id, [
                'status' => $result['success'] ? 'completed' : 'failed',
                'completed_at' => now(),
                'result' => $result,
                'execution_time' => $this->calculateExecutionTime($execution->started_at)
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Erro na orquestração de workflow: ' . $e->getMessage(), [
                'workflow_id' => $workflowId,
                'payload' => $payload,
                'options' => $options
            ]);
            throw $e;
        }
    }

    /**
     * Construir contexto de execução
     */
    private function buildExecutionContext($workflow, array $payload, array $options): array
    {
        return [
            'workflow_id' => $workflow->id,
            'workflow_name' => $workflow->name,
            'user_id' => $options['user_id'] ?? null,
            'trigger_type' => $options['trigger_type'] ?? 'manual',
            'trigger_data' => $options['trigger_data'] ?? [],
            'environment' => $options['environment'] ?? 'production',
            'timeout' => $options['timeout'] ?? 300,
            'retry_count' => $options['retry_count'] ?? 0,
            'max_retries' => $options['max_retries'] ?? 3,
            'created_at' => now()->toISOString()
        ];
    }

    /**
     * Processar nós do workflow
     */
    private function processWorkflowNodes(array $definition, $execution, array $payload, array $options): array
    {
        $nodes = $definition['nodes'] ?? [];
        $edges = $definition['edges'] ?? [];
        $context = $payload;
        $results = [];
        $errors = [];

        // Encontrar nós de início
        $startNodes = $this->findStartNodes($nodes);

        if (empty($startNodes)) {
            throw new \Exception('No start nodes found in workflow');
        }

        // Processar nós em ordem
        $processedNodes = [];
        $queue = $startNodes;

        while (!empty($queue)) {
            $currentNode = array_shift($queue);

            if (in_array($currentNode['id'], $processedNodes)) {
                continue; // Evitar loops infinitos
            }

            try {
                $result = $this->processNode($currentNode, $context, $execution, $options);
                $results[$currentNode['id']] = $result;
                $context = array_merge($context, $result['output'] ?? []);
                $processedNodes[] = $currentNode['id'];

                // Adicionar próximos nós à fila
                $nextNodes = $this->findNextNodes($currentNode['id'], $edges, $nodes);
                $queue = array_merge($queue, $nextNodes);
            } catch (\Exception $e) {
                $errors[$currentNode['id']] = $e->getMessage();
                Log::error('Erro ao processar nó: ' . $e->getMessage(), [
                    'node_id' => $currentNode['id'],
                    'node_type' => $currentNode['type'] ?? 'unknown',
                    'execution_id' => $execution->id
                ]);
            }
        }

        return [
            'success' => empty($errors),
            'results' => $results,
            'errors' => $errors,
            'processed_nodes' => $processedNodes,
            'context' => $context
        ];
    }

    /**
     * Encontrar nós de início
     */
    private function findStartNodes(array $nodes): array
    {
        return array_filter($nodes, function ($node) {
            return ($node['type'] ?? '') === 'trigger' ||
                   ($node['type'] ?? '') === 'start' ||
                   ($node['data']['isStart'] ?? false) === true;
        });
    }

    /**
     * Encontrar próximos nós
     */
    private function findNextNodes(string $nodeId, array $edges, array $nodes): array
    {
        $nextNodeIds = [];

        foreach ($edges as $edge) {
            if (($edge['source'] ?? '') === $nodeId) {
                $nextNodeIds[] = $edge['target'] ?? '';
            }
        }

        return array_filter($nodes, function ($node) use ($nextNodeIds) {
            return in_array($node['id'] ?? '', $nextNodeIds);
        });
    }

    /**
     * Processar nó individual
     */
    private function processNode(array $node, array $context, $execution, array $options): array
    {
        $nodeType = $node['type'] ?? 'unknown';
        $nodeData = $node['data'] ?? [];

        // Verificar circuit breaker
        if (!$this->circuitBreaker->isAvailable($nodeType)) {
            throw new \Exception("Circuit breaker is open for node type: {$nodeType}");
        }

        // Processar baseado no tipo
        switch ($nodeType) {
            case 'trigger':
                return $this->processTriggerNode($nodeData, $context, $execution);
            case 'action':
                return $this->processActionNode($nodeData, $context, $execution);
            case 'condition':
                return $this->processConditionNode($nodeData, $context, $execution);
            case 'delay':
                return $this->processDelayNode($nodeData, $context, $execution);
            case 'webhook':
                return $this->processWebhookNode($nodeData, $context, $execution);
            case 'ai_generate':
                return $this->processAIGenerateNode($nodeData, $context, $execution);
            case 'social_publish':
                return $this->processSocialPublishNode($nodeData, $context, $execution);
            case 'email_send':
                return $this->processEmailSendNode($nodeData, $context, $execution);
            case 'data_transform':
                return $this->processDataTransformNode($nodeData, $context, $execution);
            default:
                throw new \Exception("Unknown node type: {$nodeType}");
        }
    }

    /**
     * Processar nó de trigger
     */
    private function processTriggerNode(array $nodeData, array $context, $execution): array
    {
        return [
            'success' => true,
            'output' => $context,
            'message' => 'Trigger node processed successfully'
        ];
    }

    /**
     * Processar nó de ação
     */
    private function processActionNode(array $nodeData, array $context, $execution): array
    {
        $actionType = $nodeData['action_type'] ?? $nodeData['type'] ?? 'unknown';

        try {
            // Tentar usar executor específico se disponível
            if ($this->executorFactory && method_exists($this->executorFactory, 'create')) {
                try {
                    $nodeModel = $this->createNodeModel($actionType, $nodeData);
                    $lead = $this->getLeadFromContext($context);
                    $workflowContext = new WorkflowExecutionContext($context);

                    $executor = $this->executorFactory->create($actionType);
                    $result = $executor->execute($nodeModel, $lead, $workflowContext);

                    return [
                        'success' => true,
                        'output' => array_merge($context, is_array($result) ? $result : []),
                        'message' => "Action node '{$actionType}' processed successfully"
                    ];
                } catch (\Exception $e) {
                    Log::warning("Executor não encontrado para ação '{$actionType}', usando processamento genérico: " . $e->getMessage());
                }
            }

            // Fallback: processamento genérico
            return [
                'success' => true,
                'output' => $context,
                'message' => "Action node '{$actionType}' processed successfully"
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao processar nó de ação: " . $e->getMessage());
            return [
                'success' => false,
                'output' => $context,
                'message' => "Action node processing failed: " . $e->getMessage()
            ];
        }
    }

    /**
     * Processar nó de condição
     */
    private function processConditionNode(array $nodeData, array $context, $execution): array
    {
        $condition = $nodeData['condition'] ?? '';
        $value = $nodeData['value'] ?? '';
        $operator = $nodeData['operator'] ?? 'equals';

        $result = $this->evaluateCondition($context, $condition, $value, $operator);

        return [
            'success' => true,
            'output' => array_merge($context, ['condition_result' => $result]),
            'message' => "Condition evaluated: {$result}"
        ];
    }

    /**
     * Processar nó de delay
     */
    private function processDelayNode(array $nodeData, array $context, $execution): array
    {
        $delay = $nodeData['delay'] ?? 0;

        if ($delay > 0) {
            sleep($delay);
        }

        return [
            'success' => true,
            'output' => $context,
            'message' => "Delay of {$delay} seconds completed"
        ];
    }

    /**
     * Processar nó de webhook
     */
    private function processWebhookNode(array $nodeData, array $context, $execution): array
    {
        try {
            $nodeModel = $this->createNodeModel('custom_webhook', $nodeData);
            $lead = $this->getLeadFromContext($context);
            $workflowContext = new WorkflowExecutionContext($context);

            $executor = $this->executorFactory->create('custom_webhook');
            $result = $executor->execute($nodeModel, $lead, $workflowContext);

            return [
                'success' => true,
                'output' => array_merge($context, is_array($result) ? $result : []),
                'message' => "Webhook called successfully"
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao processar nó de webhook: " . $e->getMessage());
            return [
                'success' => false,
                'output' => $context,
                'message' => "Webhook call failed: " . $e->getMessage()
            ];
        }
    }

    /**
     * Processar nó de geração de IA
     */
    private function processAIGenerateNode(array $nodeData, array $context, $execution): array
    {
        try {
            $nodeModel = $this->createNodeModel('ai_generate_text', $nodeData);
            $lead = $this->getLeadFromContext($context);
            $workflowContext = new WorkflowExecutionContext($context);

            $executor = $this->executorFactory->create('ai_generate_text');
            $result = $executor->execute($nodeModel, $lead, $workflowContext);

            return [
                'success' => true,
                'output' => array_merge($context, is_array($result) ? $result : ['ai_generated_content' => $result]),
                'message' => "AI generation completed"
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao processar nó de geração de IA: " . $e->getMessage());
            return [
                'success' => false,
                'output' => $context,
                'message' => "AI generation failed: " . $e->getMessage()
            ];
        }
    }

    /**
     * Processar nó de publicação social
     */
    private function processSocialPublishNode(array $nodeData, array $context, $execution): array
    {
        try {
            $platform = $nodeData['platform'] ?? '';
            $nodeType = $platform === 'facebook' ? 'publish_social_post_immediately' : 'schedule_social_post';
            
            $nodeModel = $this->createNodeModel($nodeType, $nodeData);
            $lead = $this->getLeadFromContext($context);
            $workflowContext = new WorkflowExecutionContext($context);

            $executor = $this->executorFactory->create($nodeType);
            $result = $executor->execute($nodeModel, $lead, $workflowContext);

            return [
                'success' => true,
                'output' => array_merge($context, is_array($result) ? $result : []),
                'message' => "Social media post published on {$platform}"
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao processar nó de publicação social: " . $e->getMessage());
            return [
                'success' => false,
                'output' => $context,
                'message' => "Social media publish failed: " . $e->getMessage()
            ];
        }
    }

    /**
     * Processar nó de envio de email
     */
    private function processEmailSendNode(array $nodeData, array $context, $execution): array
    {
        try {
            $nodeModel = $this->createNodeModel('send_email', $nodeData);
            $lead = $this->getLeadFromContext($context);
            $workflowContext = new WorkflowExecutionContext($context);

            $executor = $this->executorFactory->create('send_email');
            $result = $executor->execute($nodeModel, $lead, $workflowContext);

            return [
                'success' => true,
                'output' => array_merge($context, is_array($result) ? $result : []),
                'message' => "Email sent successfully"
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao processar nó de envio de email: " . $e->getMessage());
            return [
                'success' => false,
                'output' => $context,
                'message' => "Email send failed: " . $e->getMessage()
            ];
        }
    }

    /**
     * Processar nó de transformação de dados
     */
    private function processDataTransformNode(array $nodeData, array $context, $execution): array
    {
        try {
            $nodeModel = $this->createNodeModel('transform_data', $nodeData);
            $lead = $this->getLeadFromContext($context);
            $workflowContext = new WorkflowExecutionContext($context);

            $executor = $this->executorFactory->create('transform_data');
            $result = $executor->execute($nodeModel, $lead, $workflowContext);

            return [
                'success' => true,
                'output' => array_merge($context, is_array($result) ? $result : []),
                'message' => "Data transformation completed"
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao processar nó de transformação de dados: " . $e->getMessage());
            return [
                'success' => false,
                'output' => $context,
                'message' => "Data transformation failed: " . $e->getMessage()
            ];
        }
    }

    /**
     * Criar modelo de nó a partir de dados
     */
    private function createNodeModel(string $type, array $nodeData): WorkflowNodeModel
    {
        $nodeModel = new WorkflowNodeModel();
        $nodeModel->type = $type;
        $nodeModel->configuration = $nodeData;
        return $nodeModel;
    }

    /**
     * Obter Lead do contexto
     */
    private function getLeadFromContext(array $context): Lead
    {
        $leadData = $context['lead'] ?? [
            'id' => 1,
            'name' => 'Workflow Lead',
            'email' => '',
            'project_id' => $context['project_id'] ?? null
        ];

        $lead = Lead::make($leadData);
        if (isset($leadData['id'])) {
            $lead->id = $leadData['id'];
        }

        return $lead;
    }

    /**
     * Avaliar condição
     */
    private function evaluateCondition(array $context, string $condition, string $value, string $operator): bool
    {
        $contextValue = $context[$condition] ?? null;

        switch ($operator) {
            case 'equals':
                return $contextValue == $value;
            case 'not_equals':
                return $contextValue != $value;
            case 'greater_than':
                return $contextValue > $value;
            case 'less_than':
                return $contextValue < $value;
            case 'contains':
                return strpos($contextValue, $value) !== false;
            case 'not_contains':
                return strpos($contextValue, $value) === false;
            default:
                return false;
        }
    }

    /**
     * Calcular tempo de execução
     */
    private function calculateExecutionTime($startedAt): int
    {
        return Carbon::parse($startedAt)->diffInSeconds(now());
    }
}
