<?php

namespace App\Domains\Workflows\Application\Handlers;

use App\Domains\Workflows\Application\Queries\GetWorkflowQuery;
use App\Domains\Workflows\Domain\Repositories\WorkflowRepositoryInterface;
use App\Domains\Workflows\Domain\Services\WorkflowServiceInterface;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowId;
use App\Domains\Workflows\Domain\Exceptions\WorkflowNotFoundException;
use Illuminate\Support\Facades\Log;

class GetWorkflowHandler
{
    public function __construct(
        private WorkflowRepositoryInterface $workflowRepository,
        private WorkflowServiceInterface $workflowService
    ) {
    }

    public function handle(GetWorkflowQuery $query)
    {
        try {
            // Buscar o workflow
            $workflowId = new WorkflowId($query->workflowId);
            $workflow = $this->workflowRepository->findById($workflowId);

            if (!$workflow) {
                throw new WorkflowNotFoundException("Workflow with ID {$query->workflowId} not found");
            }

            // Verificar se o usuário tem acesso ao workflow
            if ($workflow->getUserId() !== $query->userId) {
                throw new WorkflowNotFoundException("Workflow not found or access denied");
            }

            // Enriquecer com dados adicionais se solicitado
            if ($query->includeNodes) {
                try {
                    $nodes = $this->workflowService->getWorkflowNodes($workflowId);
                    $workflow->setNodes($nodes);
                } catch (\Exception $e) {
                    Log::warning('Failed to load nodes for workflow', [
                        'workflow_id' => $query->workflowId,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            if ($query->includeExecutions) {
                try {
                    $executions = $this->workflowService->getWorkflowExecutions($workflowId);
                    $workflow->setExecutions($executions);
                } catch (\Exception $e) {
                    Log::warning('Failed to load executions for workflow', [
                        'workflow_id' => $query->workflowId,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            if ($query->includeAnalytics) {
                try {
                    $analytics = $this->workflowService->getWorkflowAnalytics($workflowId);
                    $workflow->setAnalytics($analytics);
                } catch (\Exception $e) {
                    Log::warning('Failed to load analytics for workflow', [
                        'workflow_id' => $query->workflowId,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            if ($query->includeConfiguration) {
                try {
                    $configuration = $this->workflowService->getWorkflowConfiguration($workflowId);
                    $workflow->setConfiguration($configuration);
                } catch (\Exception $e) {
                    Log::warning('Failed to load configuration for workflow', [
                        'workflow_id' => $query->workflowId,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            Log::info('Workflow retrieved successfully', [
                'workflow_id' => $query->workflowId,
                'user_id' => $query->userId,
                'include_nodes' => $query->includeNodes,
                'include_executions' => $query->includeExecutions,
                'include_analytics' => $query->includeAnalytics,
                'include_configuration' => $query->includeConfiguration
            ]);

            return $workflow;
        } catch (\Exception $e) {
            Log::error('Failed to get workflow', [
                'workflow_id' => $query->workflowId,
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
