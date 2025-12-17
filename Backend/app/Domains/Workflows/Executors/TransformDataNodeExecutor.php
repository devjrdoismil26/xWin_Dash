<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class TransformDataNodeExecutor implements WorkflowNodeExecutor
{
    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado com os dados transformados
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a transformação falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando TransformDataNodeExecutor para node {$node->id}.");

        $config = $this->extractConfig($node->configuration ?? []);
        $this->validateTransformations($config['transformations']);

        // Construir payload para substituição de placeholders
        $payload = [
            'lead_id' => $lead->id,
            'lead_name' => $lead->name ?? '',
            'lead_email' => $lead->email ?? '',
            ...$context->getData()
        ];
        
        $transformedData = $this->processTransformations($config['transformations'], $payload);
        
        // Adicionar resultado ao contexto
        $context->setData($config['outputField'], $transformedData);
        $context->setData('transformation_metadata', [
            'transformations_count' => count($config['transformations']),
            'transformed_at' => now()->toIso8601String()
        ]);

        Log::info("Dados transformados e adicionados ao contexto no campo '{$config['outputField']}'.");

        return $context->getData();
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
        $outputField = $config['output_field'] ?? 'transformed_data';
        $transformedData = $context->getData($outputField);

        // Se transformação foi bem-sucedida, seguir para próximo nó
        if ($transformedData !== null) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Extrai e valida a configuração do nó.
     */
    private function extractConfig(array $config): array
    {
        return [
            'transformations' => $config['transformations'] ?? [],
            'outputField' => $config['output_field'] ?? 'transformed_data'
        ];
    }

    /**
     * Valida se as transformações são válidas.
     */
    private function validateTransformations(array $transformations): void
    {
        if (empty($transformations) || !is_array($transformations)) {
            throw new WorkflowExecutionException("Nó de transformação de dados inválido: 'transformations' é obrigatório e deve ser um array.");
        }
    }

    /**
     * Processa todas as transformações.
     */
    private function processTransformations(array $transformations, array $payload): array
    {
        $transformedData = $payload;

        foreach ($transformations as $transformation) {
            $this->validateTransformation($transformation);
            
            if (!$this->sourceFieldExists($transformation, $transformedData)) {
                continue;
            }

            $transformedData = $this->applyTransformation($transformation, $transformedData);
        }

        return $transformedData;
    }

    /**
     * Valida uma transformação individual.
     */
    private function validateTransformation(array $transformation): void
    {
        $type = $transformation['type'] ?? null;
        $sourceField = $transformation['source_field'] ?? null;
        $targetField = $transformation['target_field'] ?? null;

        if (!$type || !$sourceField || !$targetField) {
            throw new WorkflowExecutionException("Transformação inválida: 'type', 'source_field' e 'target_field' são obrigatórios.");
        }
    }

    /**
     * Verifica se o campo de origem existe.
     */
    private function sourceFieldExists(array $transformation, array $data): bool
    {
        $sourceField = $transformation['source_field'];
        
        if (!isset($data[$sourceField])) {
            Log::warning("Campo de origem '{$sourceField}' não encontrado no payload para transformação.");
            return false;
        }

        return true;
    }

    /**
     * Aplica uma transformação específica.
     */
    private function applyTransformation(array $transformation, array $data): array
    {
        $type = $transformation['type'];
        $sourceField = $transformation['source_field'];
        $targetField = $transformation['target_field'];
        $value = $transformation['value'] ?? null;

        return match ($type) {
            'map' => $this->mapField($data, $sourceField, $targetField),
            'set_value' => $this->setValue($data, $targetField, $value),
            'concatenate' => $this->concatenateField($data, $sourceField, $targetField),
            'uppercase' => $this->uppercaseField($data, $sourceField, $targetField),
            'lowercase' => $this->lowercaseField($data, $sourceField, $targetField),
            default => throw new WorkflowExecutionException("Tipo de transformação desconhecido: {$type}.")
        };
    }

    /**
     * Mapeia um campo para outro.
     */
    private function mapField(array $data, string $sourceField, string $targetField): array
    {
        $data[$targetField] = $data[$sourceField];
        return $data;
    }

    /**
     * Define um valor específico.
     */
    private function setValue(array $data, string $targetField, mixed $value): array
    {
        $data[$targetField] = $value;
        return $data;
    }

    /**
     * Concatena campos.
     */
    private function concatenateField(array $data, string $sourceField, string $targetField): array
    {
        $data[$targetField] = ($data[$targetField] ?? '') . $data[$sourceField];
        return $data;
    }

    /**
     * Converte para maiúsculas.
     */
    private function uppercaseField(array $data, string $sourceField, string $targetField): array
    {
        $data[$targetField] = strtoupper($data[$sourceField]);
        return $data;
    }

    /**
     * Converte para minúsculas.
     */
    private function lowercaseField(array $data, string $sourceField, string $targetField): array
    {
        $data[$targetField] = strtolower($data[$sourceField]);
        return $data;
    }
}
