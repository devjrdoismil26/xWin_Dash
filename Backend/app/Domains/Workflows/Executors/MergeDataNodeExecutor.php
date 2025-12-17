<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class MergeDataNodeExecutor implements WorkflowNodeExecutor
{
    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado com os dados mesclados
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a mesclagem falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando MergeDataNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $sources = $config['sources'] ?? [];
        $strategy = $config['strategy'] ?? 'replace';
        $outputField = $config['output_field'] ?? 'merged_data';

        $this->validateMergeConfig($sources);

        // Construir payload para substituição de placeholders
        $payload = [
            'lead_id' => $lead->id,
            'lead_name' => $lead->name ?? '',
            ...$context->getData()
        ];

        $mergedData = $this->mergeDataFromSources($sources, $strategy, $payload);
        
        // Adicionar resultado ao contexto
        $context->setData($outputField, $mergedData);
        $context->setData('merge_metadata', [
            'sources_count' => count($sources),
            'strategy' => $strategy,
            'merged_at' => now()->toIso8601String()
        ]);

        Log::info("Dados mesclados e adicionados ao contexto no campo '{$outputField}'.");
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
        $outputField = $config['output_field'] ?? 'merged_data';
        $mergedData = $context->getData($outputField);

        // Se mesclagem foi bem-sucedida, seguir para próximo nó
        if ($mergedData !== null) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Valida a configuração de mesclagem.
     *
     * @param array $sources
     * @throws WorkflowExecutionException
     */
    private function validateMergeConfig(array $sources): void
    {
        if (empty($sources) || !is_array($sources)) {
            throw new WorkflowExecutionException("Nó de mesclagem de dados inválido: 'sources' é obrigatório e deve ser um array.");
        }
    }

    /**
     * Mescla dados das fontes especificadas.
     *
     * @param array $sources
     * @param string $strategy
     * @param array $payload
     * @return array
     * @throws WorkflowExecutionException
     */
    private function mergeDataFromSources(array $sources, string $strategy, array $payload): array
    {
        $mergedData = [];

        foreach ($sources as $sourceKey) {
            if (isset($payload[$sourceKey])) {
                $sourceData = $payload[$sourceKey];
                $mergedData = $this->applyMergeStrategy($mergedData, $sourceData, $strategy);
            }
        }

        return $mergedData;
    }

    /**
     * Aplica a estratégia de mesclagem.
     *
     * @param array $mergedData
     * @param mixed $sourceData
     * @param string $strategy
     * @return array
     * @throws WorkflowExecutionException
     */
    private function applyMergeStrategy(array $mergedData, $sourceData, string $strategy): array
    {
        return match ($strategy) {
            'replace' => $sourceData,
            'merge_recursive' => array_merge_recursive($mergedData, $sourceData),
            'append' => $this->appendData($mergedData, $sourceData),
            default => throw new WorkflowExecutionException("Estratégia de mesclagem desconhecida: {$strategy}.")
        };
    }

    /**
     * Adiciona dados ao array mesclado.
     *
     * @param array $mergedData
     * @param mixed $sourceData
     * @return array
     */
    private function appendData(array $mergedData, $sourceData): array
    {
        if (is_array($sourceData)) {
            return array_merge($mergedData, $sourceData);
        }

        $mergedData[] = $sourceData;
        return $mergedData;
    }
}
