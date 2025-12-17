<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class IfElseNodeExecutor implements WorkflowNodeExecutor
{
    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return bool the result of the execution, which can be used by subsequent nodes
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a condição não puder ser avaliada
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): mixed
    {
        Log::info("Executando IfElseNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $this->validateNodeConfig($config);

        try {
            $payload = $this->buildEvaluationPayload($lead, $context);
            $conditionResult = $this->evaluateCondition($config['condition'], $payload);
            
            $this->updateContextWithResult($context, $conditionResult);
            $this->logConditionResult($conditionResult, $lead->id);

            return $conditionResult;
        } catch (\Exception $e) {
            Log::error("Falha ao avaliar condição no nó If/Else: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha ao avaliar condição: " . $e->getMessage());
        }
    }

    /**
     * Valida a configuração do nó.
     *
     * @param array<string, mixed> $config
     * @throws WorkflowExecutionException
     */
    private function validateNodeConfig(array $config): void
    {
        $condition = $config['condition'] ?? null;
        if (!$condition) {
            throw new WorkflowExecutionException("Nó If/Else inválido: 'condition' é obrigatória.");
        }
    }

    /**
     * Constrói o payload para avaliação da condição.
     *
     * @param Lead $lead
     * @param WorkflowExecutionContext $context
     * @return array<string, mixed>
     */
    private function buildEvaluationPayload(Lead $lead, WorkflowExecutionContext $context): array
    {
        return [
            'lead_id' => $lead->id,
            'lead_score' => $lead->score ?? 0,
            'lead_status' => $lead->status ?? 'new',
            'lead_source' => $lead->source ?? 'unknown',
            ...$context->getData()
        ];
    }

    /**
     * Atualiza o contexto com o resultado da condição.
     *
     * @param WorkflowExecutionContext $context
     * @param bool $conditionResult
     */
    private function updateContextWithResult(WorkflowExecutionContext $context, bool $conditionResult): void
    {
        $context->setData('condition_result', $conditionResult);
        $context->setData('evaluated_at', now()->toISOString());
    }

    /**
     * Registra o resultado da condição no log.
     *
     * @param bool $conditionResult
     * @param int $leadId
     */
    private function logConditionResult(bool $conditionResult, int $leadId): void
    {
        $result = $conditionResult ? 'verdadeira' : 'falsa';
        Log::info("Condição avaliada como {$result} para lead {$leadId}.");
    }

    /**
     * Determine the ID of the next node to be executed.
     *
     * @param WorkflowNodeModel        $node    the current node
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context, including the result of the current node's execution
     *
     * @return string|null the ID of the next node, or null if it's the end of the path
     */
    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        $conditionResult = $context->getData('condition_result');
        $config = $node->configuration ?? [];

        $truePath = $config['true_path'] ?? null;
        $falsePath = $config['false_path'] ?? null;

        if ($conditionResult && $truePath) {
            Log::info("Condição verdadeira: próximo nó será {$truePath}");
            return $truePath;
        } elseif (!$conditionResult && $falsePath) {
            Log::info("Condição falsa: próximo nó será {$falsePath}");
            return $falsePath;
        }

        Log::info("Nenhum caminho definido para o resultado da condição");
        return null;
    }

    /**
     * Avalia uma condição com base no payload.
     *
     * @param array<string, mixed> $condition a condição a ser avaliada (ex: ['field' => 'score', 'operator' => '>', 'value' => 50])
     * @param array<string, mixed> $payload   o payload atual do workflow
     *
     * @return bool o resultado da avaliação da condição
     *
     * @throws WorkflowExecutionException se o operador for inválido ou o campo não existir
     */
    protected function evaluateCondition(array $condition, array $payload): bool
    {
        $field = $condition['field'] ?? null;
        $operator = $condition['operator'] ?? null;
        $value = $condition['value'] ?? null;

        if (!$field || !$operator) {
            throw new WorkflowExecutionException("Condição inválida: 'field' e 'operator' são obrigatórios.");
        }

        if (!isset($payload[$field])) {
            Log::warning("Campo '{$field}' não encontrado no payload para avaliação da condição.");
            return false; // Ou lançar uma exceção, dependendo da regra de negócio
        }

        $fieldValue = $payload[$field];

        return match ($operator) {
            '==' => $fieldValue == $value,
            '!=' => $fieldValue != $value,
            '>' => $fieldValue > $value,
            '<' => $fieldValue < $value,
            '>=' => $fieldValue >= $value,
            '<=' => $fieldValue <= $value,
            'contains' => is_string($fieldValue) && is_string($value) && str_contains($fieldValue, $value),
            'not_contains' => is_string($fieldValue) && is_string($value) && !str_contains($fieldValue, $value),
            'is_empty' => empty($fieldValue),
            'not_empty' => !empty($fieldValue),
            default => throw new WorkflowExecutionException("Operador de condição inválido: {$operator}"),
        };
    }
}
