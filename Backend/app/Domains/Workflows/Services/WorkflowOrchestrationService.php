<?php

namespace App\Domains\Workflows\Services;

use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionRepository;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Carbon\Carbon;

/**
 * 🎭 Workflow Orchestration Service
 *
 * Serviço principal para orquestração de workflows
 * Orquestra os serviços especializados de execução
 */
class WorkflowOrchestrationService
{
    private WorkflowExecutionOrchestrator $executionOrchestrator;

    public function __construct(
        private WorkflowModel $workflows,
        private WorkflowExecutionRepository $executions,
        private CircuitBreakerService $circuitBreaker,
        private WebhookService $webhookService,
        WorkflowExecutionOrchestrator $executionOrchestrator
    ) {
        $this->executionOrchestrator = $executionOrchestrator;
    }

    /**
     * Orquestrar execução de workflow
     */
    public function orchestrateWorkflow(int $workflowId, array $payload, array $options = []): array
    {
        return $this->executionOrchestrator->orchestrateWorkflow($workflowId, $payload, $options);
    }

    /**
     * Executar workflow de forma assíncrona
     */
    public function executeWorkflowAsync(int $workflowId, array $payload, array $options = []): string
    {
        try {
            $jobId = uniqid('workflow_', true);

            Queue::push('WorkflowExecutionJob', [
                'workflow_id' => $workflowId,
                'payload' => $payload,
                'options' => $options,
                'job_id' => $jobId
            ]);

            Log::info('Workflow execution queued', [
                'workflow_id' => $workflowId,
                'job_id' => $jobId,
                'options' => $options
            ]);

            return $jobId;
        } catch (\Exception $e) {
            Log::error('Erro ao enfileirar execução de workflow: ' . $e->getMessage(), [
                'workflow_id' => $workflowId,
                'payload' => $payload,
                'options' => $options
            ]);
            throw $e;
        }
    }

    /**
     * Obter status de execução
     */
    public function getExecutionStatus(int $executionId): array
    {
        try {
            $execution = $this->executions->find($executionId);

            if (!$execution) {
                throw new \Exception('Execution not found');
            }

            return [
                'id' => $execution->id,
                'workflow_id' => $execution->workflow_id,
                'status' => $execution->status,
                'started_at' => $execution->started_at,
                'completed_at' => $execution->completed_at,
                'execution_time' => $execution->execution_time,
                'result' => $execution->result,
                'error' => $execution->error
            ];
        } catch (\Exception $e) {
            Log::error('Erro ao obter status de execução: ' . $e->getMessage(), [
                'execution_id' => $executionId
            ]);
            throw $e;
        }
    }

    /**
     * Cancelar execução
     */
    public function cancelExecution(int $executionId): bool
    {
        try {
            $execution = $this->executions->find($executionId);

            if (!$execution) {
                throw new \Exception('Execution not found');
            }

            if ($execution->status === 'completed' || $execution->status === 'failed') {
                throw new \Exception('Cannot cancel completed or failed execution');
            }

            $this->executions->update($executionId, [
                'status' => 'cancelled',
                'completed_at' => now(),
                'error' => 'Execution cancelled by user'
            ]);

            Log::info('Execution cancelled', [
                'execution_id' => $executionId
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Erro ao cancelar execução: ' . $e->getMessage(), [
                'execution_id' => $executionId
            ]);
            throw $e;
        }
    }

    /**
     * Obter histórico de execuções
     */
    public function getExecutionHistory(int $workflowId, int $limit = 50): array
    {
        try {
            $executions = $this->executions->getByWorkflowId($workflowId, $limit);

            return $executions->map(function ($execution) {
                return [
                    'id' => $execution->id,
                    'status' => $execution->status,
                    'started_at' => $execution->started_at,
                    'completed_at' => $execution->completed_at,
                    'execution_time' => $execution->execution_time,
                    'success' => $execution->status === 'completed'
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::error('Erro ao obter histórico de execuções: ' . $e->getMessage(), [
                'workflow_id' => $workflowId,
                'limit' => $limit
            ]);
            throw $e;
        }
    }

    /**
     * Obter estatísticas de execução
     */
    public function getExecutionStats(int $workflowId): array
    {
        try {
            $executions = $this->executions->getByWorkflowId($workflowId, 1000);

            $total = $executions->count();
            $completed = $executions->where('status', 'completed')->count();
            $failed = $executions->where('status', 'failed')->count();
            $running = $executions->where('status', 'running')->count();
            $cancelled = $executions->where('status', 'cancelled')->count();

            $successRate = $total > 0 ? ($completed / $total) * 100 : 0;
            $failureRate = $total > 0 ? ($failed / $total) * 100 : 0;

            $avgExecutionTime = $executions->where('execution_time', '>', 0)
                ->avg('execution_time');

            return [
                'total_executions' => $total,
                'completed_executions' => $completed,
                'failed_executions' => $failed,
                'running_executions' => $running,
                'cancelled_executions' => $cancelled,
                'success_rate' => round($successRate, 2),
                'failure_rate' => round($failureRate, 2),
                'average_execution_time' => round($avgExecutionTime, 2)
            ];
        } catch (\Exception $e) {
            Log::error('Erro ao obter estatísticas de execução: ' . $e->getMessage(), [
                'workflow_id' => $workflowId
            ]);
            throw $e;
        }
    }

    /**
     * Verificar se workflow pode ser executado
     */
    public function canExecuteWorkflow(int $workflowId): bool
    {
        try {
            $workflow = $this->workflows->find($workflowId);

            if (!$workflow) {
                return false;
            }

            if (!$workflow->is_active) {
                return false;
            }

            $definition = (array) ($workflow->canvas_definition ?? []);
            if (empty($definition)) {
                return false;
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Erro ao verificar se workflow pode ser executado: ' . $e->getMessage(), [
                'workflow_id' => $workflowId
            ]);
            return false;
        }
    }

    /**
     * Obter workflows ativos
     */
    public function getActiveWorkflows(): array
    {
        try {
            $workflows = $this->workflows->where('is_active', true)->get();

            return $workflows->map(function ($workflow) {
                return [
                    'id' => $workflow->id,
                    'name' => $workflow->name,
                    'type' => $workflow->type,
                    'priority' => $workflow->priority,
                    'created_at' => $workflow->created_at,
                    'updated_at' => $workflow->updated_at
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::error('Erro ao obter workflows ativos: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obter workflows por tipo
     */
    public function getWorkflowsByType(string $type): array
    {
        try {
            $workflows = $this->workflows->where('type', $type)->get();

            return $workflows->map(function ($workflow) {
                return [
                    'id' => $workflow->id,
                    'name' => $workflow->name,
                    'type' => $workflow->type,
                    'priority' => $workflow->priority,
                    'is_active' => $workflow->is_active,
                    'created_at' => $workflow->created_at,
                    'updated_at' => $workflow->updated_at
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::error('Erro ao obter workflows por tipo: ' . $e->getMessage(), [
                'type' => $type
            ]);
            throw $e;
        }
    }

    /**
     * Obter workflows por prioridade
     */
    public function getWorkflowsByPriority(string $priority): array
    {
        try {
            $workflows = $this->workflows->where('priority', $priority)->get();

            return $workflows->map(function ($workflow) {
                return [
                    'id' => $workflow->id,
                    'name' => $workflow->name,
                    'type' => $workflow->type,
                    'priority' => $workflow->priority,
                    'is_active' => $workflow->is_active,
                    'created_at' => $workflow->created_at,
                    'updated_at' => $workflow->updated_at
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::error('Erro ao obter workflows por prioridade: ' . $e->getMessage(), [
                'priority' => $priority
            ]);
            throw $e;
        }
    }
}
