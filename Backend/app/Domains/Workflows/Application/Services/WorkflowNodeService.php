<?php

namespace App\Domains\Workflows\Application\Services;

use App\Domains\Workflows\Application\UseCases\CreateWorkflowNodeUseCase;
use App\Domains\Workflows\Application\UseCases\UpdateWorkflowNodeUseCase;
use App\Domains\Workflows\Application\UseCases\DeleteWorkflowNodeUseCase;
use App\Domains\Workflows\Application\UseCases\GetWorkflowNodeUseCase;
use App\Domains\Workflows\Application\UseCases\ListWorkflowNodesUseCase;
use App\Domains\Workflows\Application\Commands\CreateWorkflowNodeCommand;
use App\Domains\Workflows\Application\Commands\UpdateWorkflowNodeCommand;
use App\Domains\Workflows\Application\Commands\DeleteWorkflowNodeCommand;
use App\Domains\Workflows\Application\Queries\GetWorkflowNodeQuery;
use App\Domains\Workflows\Application\Queries\ListWorkflowNodesQuery;
use App\Domains\Workflows\Domain\WorkflowNode;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Service especializado para operações de nós de workflow
 *
 * Responsável por gerenciar nós de workflow, incluindo
 * criação, atualização, exclusão e listagem.
 */
class WorkflowNodeService
{
    private CreateWorkflowNodeUseCase $createWorkflowNodeUseCase;
    private UpdateWorkflowNodeUseCase $updateWorkflowNodeUseCase;
    private DeleteWorkflowNodeUseCase $deleteWorkflowNodeUseCase;
    private GetWorkflowNodeUseCase $getWorkflowNodeUseCase;
    private ListWorkflowNodesUseCase $listWorkflowNodesUseCase;

    public function __construct(
        CreateWorkflowNodeUseCase $createWorkflowNodeUseCase,
        UpdateWorkflowNodeUseCase $updateWorkflowNodeUseCase,
        DeleteWorkflowNodeUseCase $deleteWorkflowNodeUseCase,
        GetWorkflowNodeUseCase $getWorkflowNodeUseCase,
        ListWorkflowNodesUseCase $listWorkflowNodesUseCase
    ) {
        $this->createWorkflowNodeUseCase = $createWorkflowNodeUseCase;
        $this->updateWorkflowNodeUseCase = $updateWorkflowNodeUseCase;
        $this->deleteWorkflowNodeUseCase = $deleteWorkflowNodeUseCase;
        $this->getWorkflowNodeUseCase = $getWorkflowNodeUseCase;
        $this->listWorkflowNodesUseCase = $listWorkflowNodesUseCase;
    }

    /**
     * Cria um novo nó de workflow
     */
    public function create(array $data): array
    {
        try {
            $command = CreateWorkflowNodeCommand::fromArray($data);
            return $this->createWorkflowNodeUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in WorkflowNodeService::create', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação do nó'],
                'message' => 'Falha ao criar nó do workflow'
            ];
        }
    }

    /**
     * Atualiza um nó de workflow
     */
    public function update(int $nodeId, array $data): array
    {
        try {
            $command = UpdateWorkflowNodeCommand::fromArray(array_merge($data, ['node_id' => $nodeId]));
            return $this->updateWorkflowNodeUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in WorkflowNodeService::update', [
                'error' => $exception->getMessage(),
                'node_id' => $nodeId,
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atualização do nó'],
                'message' => 'Falha ao atualizar nó do workflow'
            ];
        }
    }

    /**
     * Remove um nó de workflow
     */
    public function delete(int $nodeId, int $userId): array
    {
        try {
            $command = new DeleteWorkflowNodeCommand($nodeId, $userId);
            return $this->deleteWorkflowNodeUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in WorkflowNodeService::delete', [
                'error' => $exception->getMessage(),
                'node_id' => $nodeId,
                'user_id' => $userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante exclusão do nó'],
                'message' => 'Falha ao excluir nó do workflow'
            ];
        }
    }

    /**
     * Obtém um nó específico de workflow
     */
    public function get(int $nodeId, int $userId, array $options = []): array
    {
        try {
            $query = new GetWorkflowNodeQuery($nodeId, $userId, $options);
            return $this->getWorkflowNodeUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in WorkflowNodeService::get', [
                'error' => $exception->getMessage(),
                'node_id' => $nodeId,
                'user_id' => $userId,
                'options' => $options
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante busca do nó'],
                'message' => 'Falha ao buscar nó do workflow'
            ];
        }
    }

    /**
     * Lista nós de workflow do usuário
     */
    public function list(int $userId, array $filters = []): array
    {
        try {
            $query = new ListWorkflowNodesQuery($userId, $filters);
            return $this->listWorkflowNodesUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in WorkflowNodeService::list', [
                'error' => $exception->getMessage(),
                'user_id' => $userId,
                'filters' => $filters
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante listagem dos nós'],
                'message' => 'Falha ao listar nós do workflow'
            ];
        }
    }

    /**
     * Obtém um nó por ID (método auxiliar)
     */
    public function getById(int $nodeId): ?WorkflowNode
    {
        $cacheKey = "workflow_node_{$nodeId}";

        return Cache::remember($cacheKey, 300, function () use ($nodeId) {
            return WorkflowNode::find($nodeId);
        });
    }

    /**
     * Lista nós por workflow
     */
    public function getByWorkflowId(int $workflowId): array
    {
        $cacheKey = "workflow_nodes_{$workflowId}";

        return Cache::remember($cacheKey, 300, function () use ($workflowId) {
            return WorkflowNode::where('workflow_id', $workflowId)
                ->orderBy('position')
                ->get()
                ->toArray();
        });
    }

    /**
     * Valida se um nó pode ser conectado a outro
     */
    public function canConnectTo(int $fromNodeId, int $toNodeId): bool
    {
        $fromNode = $this->getById($fromNodeId);
        $toNode = $this->getById($toNodeId);

        if (!$fromNode || !$toNode) {
            return false;
        }

        // Verificar se são do mesmo workflow
        if ($fromNode->workflow_id !== $toNode->workflow_id) {
            return false;
        }

        // Verificar se não criaria um loop
        return !$this->wouldCreateLoop($fromNodeId, $toNodeId);
    }

    /**
     * Verifica se conectar dois nós criaria um loop
     */
    private function wouldCreateLoop(int $fromNodeId, int $toNodeId): bool
    {
        // Implementar lógica de detecção de loop
        // Por enquanto, retorna false (sem loop)
        return false;
    }

    /**
     * Obtém dependências de integração de um workflow
     */
    public function getWorkflowIntegrationDependencies(int $workflowId): array
    {
        $cacheKey = "workflow_integration_deps_{$workflowId}";

        return Cache::remember($cacheKey, 300, function () use ($workflowId) {
            $nodes = WorkflowNode::where('workflow_id', $workflowId)
                ->whereNotNull('integration_type')
                ->get();

            return $nodes->pluck('integration_type')->unique()->toArray();
        });
    }

    /**
     * Obtém dependências de serviço de um workflow
     */
    public function getWorkflowServiceDependencies(int $workflowId): array
    {
        $cacheKey = "workflow_service_deps_{$workflowId}";

        return Cache::remember($cacheKey, 300, function () use ($workflowId) {
            $nodes = WorkflowNode::where('workflow_id', $workflowId)
                ->whereNotNull('service_type')
                ->get();

            return $nodes->pluck('service_type')->unique()->toArray();
        });
    }
}
