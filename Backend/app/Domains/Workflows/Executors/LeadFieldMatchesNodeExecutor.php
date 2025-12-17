<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class LeadFieldMatchesNodeExecutor implements WorkflowNodeExecutor
{
    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado com o resultado da condição
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou o campo do Lead não for encontrado
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando LeadFieldMatchesNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $field = $config['field'] ?? null;
        $operator = $config['operator'] ?? null;
        $value = $config['value'] ?? null;

        if (!$field || !$operator) {
            throw new WorkflowExecutionException("Nó Lead Field Matches inválido: 'field' e 'operator' são obrigatórios.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                'lead_email' => $lead->email ?? '',
                'lead_phone' => $lead->phone ?? '',
                'lead_status' => $lead->status ?? '',
                'lead_score' => $lead->score ?? 0,
                ...$context->getData()
            ];

            // Substituir placeholders no valor com valores do contexto
            $finalValue = $value ? $this->replacePlaceholder($value, $payload) : null;

            // Obter valor do campo do lead
            $fieldValue = $this->getLeadFieldValue($lead, $field);

            if ($fieldValue === null && !in_array($operator, ['is_empty', 'not_empty'])) {
                Log::warning("Campo '{$field}' não encontrado no lead {$lead->id} para avaliação.");
                $conditionResult = false;
            } else {
                $conditionResult = $this->evaluateCondition($fieldValue, $operator, $finalValue);
            }

            // Adicionar resultado ao contexto
            $context->setData('condition_result', $conditionResult);
            $context->setData('condition_metadata', [
                'field' => $field,
                'operator' => $operator,
                'field_value' => $fieldValue,
                'expected_value' => $finalValue,
                'evaluated_at' => now()->toIso8601String()
            ]);

            Log::info("Condição de campo de Lead avaliada como " . ($conditionResult ? 'verdadeira' : 'falsa') . ".");

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao avaliar condição no nó Lead Field Matches: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha ao avaliar condição de campo de Lead: " . $e->getMessage());
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
        $conditionResult = $context->getData('condition_result') ?? false;

        // Retornar próximo nó baseado na condição
        if ($conditionResult) {
            return $config['true_node_id'] ?? $config['next_node_id'] ?? $node->next_node_id ?? null;
        } else {
            return $config['false_node_id'] ?? null;
        }
    }

    /**
     * Obtém o valor de um campo do lead.
     */
    protected function getLeadFieldValue(Lead $lead, string $field): mixed
    {
        // Campos diretos do lead
        if (isset($lead->{$field})) {
            return $lead->{$field};
        }

        // Campos de relacionamento
        if (str_contains($field, '.')) {
            $parts = explode('.', $field, 2);
            $relation = $parts[0];
            $relationField = $parts[1];

            if ($lead->relationLoaded($relation) || method_exists($lead, $relation)) {
                $related = $lead->{$relation};
                return $related?->{$relationField} ?? null;
            }
        }

        return null;
    }

    /**
     * Avalia uma condição com base no valor do campo do Lead.
     *
     * @param mixed  $fieldValue o valor do campo do Lead
     * @param string $operator   o operador de comparação (ex: '==', '>', 'contains')
     * @param mixed  $value      o valor a ser comparado
     *
     * @return bool o resultado da avaliação da condição
     *
     * @throws WorkflowExecutionException se o operador for inválido
     */
    protected function evaluateCondition(mixed $fieldValue, string $operator, mixed $value): bool
    {
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
            'starts_with' => is_string($fieldValue) && is_string($value) && str_starts_with($fieldValue, $value),
            'ends_with' => is_string($fieldValue) && is_string($value) && str_ends_with($fieldValue, $value),
            default => throw new WorkflowExecutionException("Operador de condição inválido para campo de Lead: {$operator}"),
        };
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ value }}")
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
