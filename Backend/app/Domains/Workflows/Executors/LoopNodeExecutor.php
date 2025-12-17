<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Executors\WorkflowNodeExecutorFactory;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class LoopNodeExecutor implements WorkflowNodeExecutor
{
    protected WorkflowNodeExecutorFactory $executorFactory;

    public function __construct(WorkflowNodeExecutorFactory $executorFactory)
    {
        $this->executorFactory = $executorFactory;
    }
    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após a execução do loop
     *
     * @throws WorkflowExecutionException se a configuração do loop for inválida
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando LoopNodeExecutor para node {$node->id}.");

        $loopConfig = $node->configuration ?? [];
        $this->validateLoopConfig($loopConfig);

        // Construir payload para substituição de placeholders
        $payload = [
            'lead_id' => $lead->id,
            'lead_name' => $lead->name ?? '',
            ...$context->getData()
        ];

        $loopData = $this->prepareLoopData($loopConfig, $payload);
        $updatedPayload = $this->executeLoopIterations($loopData, $payload, $loopConfig, $context);

        // Atualizar contexto com resultado do loop
        $context->setData('loop_final_count', $loopData['count']);
        $context->setData('loop_completed_at', now()->toIso8601String());

        Log::info("LoopNodeExecutor concluído. Total de iterações: {$loopData['count']}.");
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
        return $config['next_node_id'] ?? $node->next_node_id ?? null;
    }

    /**
     * Valida a configuração do loop.
     *
     * @param array<string, mixed> $loopConfig
     * @throws WorkflowExecutionException
     */
    private function validateLoopConfig(array $loopConfig): void
    {
        $iterations = $loopConfig['iterations'] ?? 0;
        $collectionKey = $loopConfig['collection_key'] ?? null;

        if ($iterations <= 0 && !$collectionKey) {
            throw new WorkflowExecutionException("Nó de loop inválido: 'iterations' ou 'collection_key' deve ser definido.");
        }
    }

    /**
     * Prepara os dados do loop.
     *
     * @param array<string, mixed> $loopConfig
     * @param array<string, mixed> $payload
     * @return array<string, mixed>
     */
    private function prepareLoopData(array $loopConfig, array $payload): array
    {
        $iterations = $loopConfig['iterations'] ?? 0;
        $collectionKey = $loopConfig['collection_key'] ?? null;
        $loopItems = [];

        if ($collectionKey && isset($payload[$collectionKey]) && is_array($payload[$collectionKey])) {
            $loopItems = $payload[$collectionKey];
            $iterations = count($loopItems);
        } elseif ($iterations > 0) {
            $loopItems = range(0, $iterations - 1);
        }

        return [
            'items' => $loopItems,
            'iterations' => $iterations,
            'count' => 0
        ];
    }

    /**
     * Executa as iterações do loop.
     *
     * @param array<string, mixed> $loopData
     * @param array<string, mixed> $payload
     * @param array<string, mixed> $loopConfig
     * @param WorkflowExecutionContext $context
     * @return array<string, mixed>
     * @throws WorkflowExecutionException
     */
    private function executeLoopIterations(array &$loopData, array $payload, array $loopConfig, WorkflowExecutionContext $context): array
    {
        $updatedPayload = $payload;
        $loopPayloadKey = $loopConfig['loop_payload_key'] ?? 'loop_item';

        foreach ($loopData['items'] as $index => $item) {
            if ($loopData['count'] >= $loopData['iterations']) {
                break;
            }

            $updatedPayload = $this->executeSingleIteration(
                $item, 
                $index, 
                $loopData['count'], 
                $updatedPayload, 
                $loopConfig, 
                $loopPayloadKey,
                $context
            );

            $loopData['count']++;
        }

        // Atualizar contexto com resultado do loop
        foreach ($updatedPayload as $key => $value) {
            if (!in_array($key, ['lead_id', 'lead_name'])) {
                $context->setData($key, $value);
            }
        }

        return $context->getData();
    }

    /**
     * Executa uma única iteração do loop.
     *
     * @param mixed $item
     * @param int $index
     * @param int $loopCount
     * @param array<string, mixed> $payload
     * @param array<string, mixed> $loopConfig
     * @param string $loopPayloadKey
     * @param WorkflowExecutionContext $context
     * @return array<string, mixed>
     * @throws WorkflowExecutionException
     */
    private function executeSingleIteration(
        $item, 
        int $index, 
        int $loopCount, 
        array $payload, 
        array $loopConfig, 
        string $loopPayloadKey,
        WorkflowExecutionContext $context
    ): array {
        Log::info("Iniciando iteração de loop #{$loopCount} para item: " . json_encode($item));

        $updatedPayload = $payload;
        $updatedPayload[$loopPayloadKey] = $item;
        $updatedPayload['loop_index'] = $index;

        // Atualizar contexto com item atual do loop
        $context->setData($loopPayloadKey, $item);
        $context->setData('loop_index', $index);
        $context->setData('loop_count', $loopCount);

        $childNodes = $loopConfig['child_nodes'] ?? [];
        foreach ($childNodes as $childNode) {
            $updatedPayload = $this->executeChildNode($childNode, $updatedPayload, $loopCount, $loopConfig);
        }

        return $updatedPayload;
    }

    /**
     * Executa um nó filho do loop.
     * Nota: Esta implementação é simplificada. Em produção, seria necessário criar WorkflowNodeModel e Lead apropriados.
     *
     * @param array<string, mixed> $childNode
     * @param array<string, mixed> $payload
     * @param int $loopCount
     * @param array<string, mixed> $loopConfig
     * @return array<string, mixed>
     * @throws WorkflowExecutionException
     */
    private function executeChildNode(array $childNode, array $payload, int $loopCount, array $loopConfig): array
    {
        try {
            $childNodeType = $childNode['type'] ?? null;
            if (!$childNodeType) {
                return $payload;
            }

            // Nota: Em produção, seria necessário criar WorkflowNodeModel e Lead apropriados
            // Por enquanto, apenas logamos a execução
            Log::info("Nó filho '{$childNodeType}' seria executado na iteração #{$loopCount}");

            // Em produção, descomentar e implementar:
            // $childExecutor = $this->executorFactory->createExecutor($childNodeType);
            // $childNodeModel = WorkflowNodeModel::find($childNode['id']);
            // $lead = Lead::find($payload['lead_id']);
            // $context = new WorkflowExecutionContext($payload);
            // $updatedPayload = $childExecutor->execute($childNodeModel, $lead, $context);
            // return $updatedPayload;

            return $payload;

        } catch (\Exception $e) {
            Log::error("Erro ao executar nó filho na iteração #{$loopCount}: " . $e->getMessage());

            $continueOnError = $loopConfig['continue_on_error'] ?? false;
            if (!$continueOnError) {
                throw new WorkflowExecutionException("Erro na execução do loop (iteração #{$loopCount}): " . $e->getMessage());
            }

            return $payload;
        }
    }
}
