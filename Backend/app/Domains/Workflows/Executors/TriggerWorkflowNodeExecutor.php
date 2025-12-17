<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Services\WorkflowService;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class TriggerWorkflowNodeExecutor implements WorkflowNodeExecutor
{
    protected WorkflowService $workflowService;

    public function __construct(WorkflowService $workflowService)
    {
        $this->workflowService = $workflowService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após o disparo do workflow
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou o disparo falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando TriggerWorkflowNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $workflowIdToTrigger = $config['workflow_id_to_trigger'] ?? null;
        $payloadToPass = $config['payload_to_pass'] ?? [];

        if (!$workflowIdToTrigger) {
            throw new WorkflowExecutionException("Nó de disparo de workflow inválido: 'workflow_id_to_trigger' é obrigatório.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders com valores do contexto
            $finalWorkflowId = $this->replacePlaceholder($workflowIdToTrigger, $payload);

            // Converter para inteiro se necessário
            $finalWorkflowId = is_numeric($finalWorkflowId) ? (int) $finalWorkflowId : $finalWorkflowId;

            if (!is_int($finalWorkflowId)) {
                throw new WorkflowExecutionException("Workflow ID inválido: deve ser um número inteiro.");
            }

            // Mesclar dados do payload atual com o payload a ser passado
            $finalPayload = array_merge($payload, $payloadToPass);
            
            // Adicionar informações do lead ao payload
            $finalPayload['lead_id'] = $lead->id;
            $finalPayload['triggered_by_workflow_id'] = $context->getData('workflow_id');
            $finalPayload['triggered_by_execution_id'] = $context->getData('execution_id');

            // Disparar o novo workflow
            $triggeredWorkflowExecution = $this->workflowService->startWorkflow($finalWorkflowId, $finalPayload);

            // Adicionar resultado ao contexto
            $context->setData('triggered_workflow_execution', [
                'success' => true,
                'workflow_id' => $finalWorkflowId,
                'execution_id' => $triggeredWorkflowExecution->id ?? null,
                'status' => $triggeredWorkflowExecution->status ?? 'running',
                'triggered_at' => now()->toIso8601String()
            ]);

            Log::info("Workflow ID: {$finalWorkflowId} disparado com sucesso. Execução ID: " . ($triggeredWorkflowExecution->id ?? 'N/A') . ".");

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao disparar workflow ID: {$workflowIdToTrigger}: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha ao disparar workflow: " . $e->getMessage());
        }
    }

    /**
     * Determine the ID of the next node to be executed.
     *
     * @param WorkflowNodeModel        $node    the current node
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return string|null the ID of the next node, or null if it's the end of the path
     */
    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        $config = $node->configuration ?? [];
        $result = $context->getData('triggered_workflow_execution');

        // Se workflow foi disparado com sucesso, seguir para próximo nó
        if ($result && isset($result['success']) && $result['success']) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ workflow_id }}")
     * @param array       $payload o payload do workflow
     *
     * @return string|null o texto com placeholder substituído ou null
     */
    protected function replacePlaceholder(?string $text, array $payload): ?string
    {
        if ($text === null) {
            return null;
        }
        return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($matches) use ($payload) {
            $key = $matches[1];
            return $payload[$key] ?? $matches[0];
        }, $text);
    }
}
