<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Factories\WorkflowNodeExecutorFactory;
use Illuminate\Support\Facades\Log;

class ExecuteNodeActivity
{
    protected WorkflowNodeExecutorFactory $executorFactory;

    public function __construct(WorkflowNodeExecutorFactory $executorFactory)
    {
        $this->executorFactory = $executorFactory;
    }

    /**
     * Executa um nó de workflow com dados simplificados.
     * Este método é um wrapper que adapta o formato simplificado para o padrão dos executors.
     *
     * @param array<string, mixed> $nodeConfig a configuração do nó a ser executado
     * @param array<string, mixed> $payload    o payload atual do workflow
     *
     * @return array<string, mixed> o payload atualizado após a execução do nó
     *
     * @throws WorkflowExecutionException se a execução do nó falhar
     */
    public function execute(array $nodeConfig, array $payload): array
    {
        $nodeId = $nodeConfig['id'] ?? 'unknown';
        $nodeType = $nodeConfig['type'] ?? 'unknown';
        Log::info("Executando ExecuteNodeActivity para nó ID: {$nodeId}, Tipo: {$nodeType}.");

        try {
            $executor = $this->executorFactory->create($nodeType);

            // Verificar se o executor tem um método execute simplificado
            if (method_exists($executor, 'executeSimple')) {
                $result = $executor->executeSimple($nodeConfig, $payload);
                return is_array($result) ? $result : array_merge($payload, ['last_result' => $result]);
            }

            // Criar objetos necessários para o executor padrão
            $nodeModel = new \App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel();
            $nodeModel->id = $nodeId;
            $nodeModel->type = $nodeType;
            $nodeModel->configuration = $nodeConfig['config'] ?? $nodeConfig;
            $nodeModel->next_node_id = $nodeConfig['next_node_id'] ?? null;

            // Criar Lead do payload ou usar lead padrão
            $leadData = $payload['lead'] ?? ['id' => 1, 'name' => 'Workflow Lead', 'email' => '', 'project_id' => $payload['project_id'] ?? null];
            $lead = \App\Domains\Leads\Models\Lead::make($leadData);
            if (isset($leadData['id'])) {
                $lead->id = $leadData['id'];
            }

            // Criar contexto de execução
            $context = new \App\Domains\Workflows\ValueObjects\WorkflowExecutionContext($payload);

            // Executar o nó
            $result = $executor->execute($nodeModel, $lead, $context);

            // Adaptar resultado para formato de payload
            if (is_array($result)) {
                $payload = array_merge($payload, $result);
            } else {
                $payload['last_result'] = $result;
            }

            // Obter próximo nó se disponível
            $nextNodeId = $executor->getNextNodeId($nodeModel, $lead, $context);
            if ($nextNodeId) {
                $payload['next_node_id'] = $nextNodeId;
            }

            Log::info("Nó ID: {$nodeId} executado com sucesso.");
            return $payload;
        } catch (\Exception $e) {
            Log::error("Falha ao executar nó ID: {$nodeId}, Tipo: {$nodeType}: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha na execução do nó: " . $e->getMessage());
        }
    }
}
