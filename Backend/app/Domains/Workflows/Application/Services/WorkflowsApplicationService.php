<?php

namespace App\Domains\Workflows\Application\Services;

use App\Domains\Workflows\Domain\Workflow;
use App\Domains\Workflows\Domain\WorkflowNode;
use App\Domains\Users\Domain\User;
use Illuminate\Support\Facades\Log;

/**
 * Application Service para Workflows (Refatorado)
 *
 * Orquestra serviços especializados e fornece interface unificada
 * para operações de workflows, nós e execuções.
 *
 * Refatorado para reduzir complexidade e melhorar manutenibilidade.
 */
class WorkflowsApplicationService
{
    private WorkflowService $workflowService;
    private WorkflowNodeService $workflowNodeService;
    private WorkflowExecutionService $workflowExecutionService;
    private WorkflowConfigurationService $workflowConfigurationService;

    public function __construct(
        WorkflowService $workflowService,
        WorkflowNodeService $workflowNodeService,
        WorkflowExecutionService $workflowExecutionService,
        WorkflowConfigurationService $workflowConfigurationService
    ) {
        $this->workflowService = $workflowService;
        $this->workflowNodeService = $workflowNodeService;
        $this->workflowExecutionService = $workflowExecutionService;
        $this->workflowConfigurationService = $workflowConfigurationService;
    }

    // ===== WORKFLOWS =====

    /**
     * Cria um novo workflow
     */
    public function createWorkflow(array $data): array
    {
        return $this->workflowService->create($data);
    }

    /**
     * Atualiza um workflow
     */
    public function updateWorkflow(int $workflowId, array $data): array
    {
        return $this->workflowService->update($workflowId, $data);
    }

    /**
     * Remove um workflow
     */
    public function deleteWorkflow(int $workflowId, int $userId): array
    {
        return $this->workflowService->delete($workflowId, $userId);
    }

    /**
     * Obtém um workflow específico
     */
    public function getWorkflow(int $workflowId, int $userId, array $options = []): array
    {
        return $this->workflowService->get($workflowId, $userId, $options);
    }

    /**
     * Lista workflows do usuário
     */
    public function listWorkflows(int $userId, array $filters = []): array
    {
        return $this->workflowService->list($userId, $filters);
    }

    // ===== EXECUÇÃO DE WORKFLOWS =====

    /**
     * Executa um workflow
     */
    public function executeWorkflow(array $data): array
    {
        return $this->workflowExecutionService->execute($data);
    }

    // ===== NÓS DE WORKFLOW =====

    /**
     * Cria um novo nó de workflow
     */
    public function createWorkflowNode(array $data): array
    {
        return $this->workflowNodeService->create($data);
    }

    /**
     * Atualiza um nó de workflow
     */
    public function updateWorkflowNode(int $nodeId, array $data): array
    {
        return $this->workflowNodeService->update($nodeId, $data);
    }

    /**
     * Remove um nó de workflow
     */
    public function deleteWorkflowNode(int $nodeId, int $userId): array
    {
        return $this->workflowNodeService->delete($nodeId, $userId);
    }

    /**
     * Obtém um nó específico de workflow
     */
    public function getWorkflowNode(int $nodeId, int $userId, array $options = []): array
    {
        return $this->workflowNodeService->get($nodeId, $userId, $options);
    }

    /**
     * Lista nós de workflow do usuário
     */
    public function listWorkflowNodes(int $userId, array $filters = []): array
    {
        return $this->workflowNodeService->list($userId, $filters);
    }

    // ===== MÉTODOS AUXILIARES =====

    /**
     * Obtém usuário por ID
     */
    public function getUserById(int $userId): ?User
    {
        try {
            return User::find($userId);
        } catch (\Throwable $exception) {
            Log::error('Error in WorkflowsApplicationService::getUserById', [
                'error' => $exception->getMessage(),
                'user_id' => $userId
            ]);
            return null;
        }
    }

    /**
     * Obtém um workflow por ID (método auxiliar)
     */
    public function getWorkflowById(int $workflowId): ?Workflow
    {
        return $this->workflowService->getById($workflowId);
    }

    /**
     * Obtém um nó por ID (método auxiliar)
     */
    public function getWorkflowNodeById(int $nodeId): ?WorkflowNode
    {
        return $this->workflowNodeService->getById($nodeId);
    }

    // ===== CONFIGURAÇÕES =====

    /**
     * Configura configurações iniciais de um workflow
     */
    public function configureInitialWorkflowSettings(Workflow $workflow): void
    {
        $this->workflowConfigurationService->configureInitialWorkflowSettings($workflow);
    }

    /**
     * Configura analytics de um workflow
     */
    public function setupWorkflowAnalytics(Workflow $workflow): void
    {
        $this->workflowConfigurationService->setupWorkflowAnalytics($workflow);
    }

    /**
     * Configura notificações de um workflow
     */
    public function setupWorkflowNotifications(Workflow $workflow): void
    {
        $this->workflowConfigurationService->setupWorkflowNotifications($workflow);
    }

    /**
     * Configura integrações de um workflow
     */
    public function setupWorkflowIntegrations(Workflow $workflow): void
    {
        $this->workflowConfigurationService->setupWorkflowIntegrations($workflow);
    }

    /**
     * Configura webhooks de um workflow
     */
    public function setupWorkflowWebhooks(Workflow $workflow): void
    {
        $this->workflowConfigurationService->setupWorkflowWebhooks($workflow);
    }

    /**
     * Configura versionamento de um workflow
     */
    public function setupWorkflowVersioning(Workflow $workflow): void
    {
        $this->workflowConfigurationService->setupWorkflowVersioning($workflow);
    }

    /**
     * Configura monitoramento de um workflow
     */
    public function setupWorkflowMonitoring(Workflow $workflow): void
    {
        $this->workflowConfigurationService->setupWorkflowMonitoring($workflow);
    }

    /**
     * Atualiza estatísticas de execução de um workflow
     */
    public function updateWorkflowExecutionStats(Workflow $workflow, array $result): void
    {
        $this->workflowConfigurationService->updateWorkflowExecutionStats($workflow, $result);
    }

    /**
     * Configura analytics de execução de um workflow
     */
    public function setupWorkflowExecutionAnalytics(Workflow $workflow, array $result): void
    {
        $this->workflowConfigurationService->setupWorkflowExecutionAnalytics($workflow, $result);
    }

    /**
     * Configura notificações de execução de um workflow
     */
    public function setupWorkflowExecutionNotifications(Workflow $workflow, array $result): void
    {
        $this->workflowConfigurationService->setupWorkflowExecutionNotifications($workflow, $result);
    }

    /**
     * Configura integrações de execução de um workflow
     */
    public function setupWorkflowExecutionIntegrations(Workflow $workflow, array $result): void
    {
        $this->workflowConfigurationService->setupWorkflowExecutionIntegrations($workflow, $result);
    }

    /**
     * Configura webhooks de execução de um workflow
     */
    public function setupWorkflowExecutionWebhooks(Workflow $workflow, array $result): void
    {
        $this->workflowConfigurationService->setupWorkflowExecutionWebhooks($workflow, $result);
    }

    /**
     * Configura monitoramento de execução de um workflow
     */
    public function setupWorkflowExecutionMonitoring(Workflow $workflow, array $result): void
    {
        $this->workflowConfigurationService->setupWorkflowExecutionMonitoring($workflow, $result);
    }

    /**
     * Configura logs de execução de um workflow
     */
    public function setupWorkflowExecutionLogs(Workflow $workflow, array $result): void
    {
        $this->workflowConfigurationService->setupWorkflowExecutionLogs($workflow, $result);
    }

    // ===== DEPENDÊNCIAS =====

    /**
     * Obtém dependências de integração de um workflow
     */
    public function getWorkflowIntegrationDependencies(int $workflowId): array
    {
        return $this->workflowNodeService->getWorkflowIntegrationDependencies($workflowId);
    }

    /**
     * Obtém dependências de serviço de um workflow
     */
    public function getWorkflowServiceDependencies(int $workflowId): array
    {
        return $this->workflowNodeService->getWorkflowServiceDependencies($workflowId);
    }

    /**
     * Verifica se uma integração está disponível
     */
    public function isIntegrationAvailable(string $integration): bool
    {
        return $this->workflowExecutionService->isIntegrationAvailable($integration);
    }

    /**
     * Verifica se um serviço está disponível
     */
    public function isServiceAvailable(string $service): bool
    {
        return $this->workflowExecutionService->isServiceAvailable($service);
    }

    // ===== MÉTRICAS E ESTATÍSTICAS =====

    /**
     * Conta workflows ativos do usuário
     */
    public function getActiveWorkflowsCount(int $userId): int
    {
        return $this->workflowService->getActiveCount($userId);
    }

    /**
     * Obtém limite máximo de workflows do usuário
     */
    public function getUserMaxActiveWorkflows(int $userId): int
    {
        return $this->workflowService->getUserMaxWorkflows($userId);
    }

    /**
     * Conta execuções concorrentes do usuário
     */
    public function getConcurrentExecutionsCount(int $userId): int
    {
        return $this->workflowExecutionService->getConcurrentExecutionsCount($userId);
    }

    /**
     * Obtém limite máximo de execuções concorrentes do usuário
     */
    public function getUserMaxConcurrentExecutions(int $userId): int
    {
        return $this->workflowExecutionService->getUserMaxConcurrentExecutions($userId);
    }

    /**
     * Conta execuções por hora do usuário
     */
    public function getHourlyExecutionsCount(int $userId): int
    {
        return $this->workflowExecutionService->getHourlyExecutionsCount($userId);
    }

    /**
     * Obtém limite máximo de execuções por hora do usuário
     */
    public function getUserMaxHourlyExecutions(int $userId): int
    {
        return $this->workflowExecutionService->getUserMaxHourlyExecutions($userId);
    }

    /**
     * Obtém estatísticas gerais do sistema
     */
    public function getStats(): array
    {
        $cacheKey = "workflows_system_stats";

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, 600, function () {
            return [
                'total_workflows' => \App\Domains\Workflows\Models\Workflow::count(),
                'total_nodes' => \App\Domains\Workflows\Models\WorkflowNode::count(),
                'total_executions' => \App\Domains\Workflows\Models\WorkflowExecution::count(),
                'active_workflows' => \App\Domains\Workflows\Models\Workflow::where('status', 'active')->count(),
                'running_executions' => \App\Domains\Workflows\Models\WorkflowExecution::where('status', 'running')->count(),
                'executions_today' => \App\Domains\Workflows\Models\WorkflowExecution::whereDate('created_at', today())->count(),
                'executions_this_month' => \App\Domains\Workflows\Models\WorkflowExecution::whereYear('created_at', date('Y'))
                    ->whereMonth('created_at', date('m'))
                    ->count()
            ];
        });
    }
}
