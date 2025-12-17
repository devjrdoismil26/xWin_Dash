<?php

namespace App\Domains\Workflows\Services;

use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionRepository;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class WorkflowExecutionService
{
    public function __construct(private WorkflowExecutionRepository $executions)
    {
    }

    /**
     * Create a new workflow execution
     * 
     * @param array<string, mixed> $payload
     * @return mixed
     */
    public function createExecution(int $workflowId, array $payload, ?int $userId = null)
    {
        return $this->executions->create([
            'workflow_id' => $workflowId,
            'status' => 'running',
            'payload' => $payload,
            'user_id' => $userId ?? Auth::id(),
            'started_at' => now(),
        ]);
    }

    /**
     * Update execution status with optional metadata
     * 
     * @param array<string, mixed> $meta
     * @return mixed
     */
    public function updateExecutionStatus(int $executionId, string $status, array $meta = [])
    {
        $updateData = array_merge(['status' => $status], $meta);
        
        // Add completion timestamp for final statuses
        if (in_array($status, ['completed', 'failed', 'cancelled'])) {
            $updateData['completed_at'] = now();
        }
        
        return $this->executions->update($executionId, $updateData);
    }

    /**
     * Get the workflow associated with an execution
     * 
     * @param int $executionId
     * @return \App\Domains\Workflows\Domain\Models\Workflow|null
     */
    public function getWorkflowByExecutionId(int $executionId)
    {
        $execution = $this->executions->find($executionId);
        
        if (!$execution) {
            Log::warning('Workflow execution not found', ['execution_id' => $executionId]);
            return null;
        }
        
        // Load the related workflow through the execution model's relationship
        return $execution->workflow ?? null;
    }

    /**
     * Record node completion with metrics
     */
    public function recordNodeCompletion(
        int $executionId, 
        string $nodeId, 
        string $status, 
        ?string $error = null,
        ?array $output = null
    ): void {
        $logData = [
            'execution_id' => $executionId,
            'node_id' => $nodeId,
            'status' => $status,
            'timestamp' => now()->toIso8601String(),
        ];

        if ($error) {
            $logData['error'] = $error;
            Log::error('Workflow node failed', $logData);
        } else {
            Log::info('Workflow node completed', $logData);
        }

        // Store node execution result in the database
        DB::table('workflow_execution_nodes')->updateOrInsert(
            [
                'execution_id' => $executionId,
                'node_id' => $nodeId,
            ],
            [
                'status' => $status,
                'error' => $error,
                'output' => $output ? json_encode($output) : null,
                'completed_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    /**
     * Get execution history for a workflow
     */
    public function getExecutionHistory(int $workflowId, int $limit = 10): array
    {
        return $this->executions
            ->getByWorkflowId($workflowId)
            ->take($limit)
            ->toArray();
    }

    /**
     * Cancel a running execution
     */
    public function cancelExecution(int $executionId, ?string $reason = null): bool
    {
        $execution = $this->executions->find($executionId);
        
        if (!$execution || $execution->status !== 'running') {
            return false;
        }

        $this->updateExecutionStatus($executionId, 'cancelled', [
            'cancelled_reason' => $reason,
            'cancelled_at' => now(),
            'cancelled_by' => Auth::id(),
        ]);

        Log::info('Workflow execution cancelled', [
            'execution_id' => $executionId,
            'reason' => $reason,
            'cancelled_by' => Auth::id(),
        ]);

        return true;
    }

    /**
     * Get executions for a workflow
     * Otimização: Cache de 2 minutos + eager loading
     */
    public function getExecutions(int $workflowId, array $filters = []): array
    {
        $perPage = $filters['per_page'] ?? 15;
        $page = $filters['page'] ?? 1;
        $status = $filters['status'] ?? null;
        
        // Cache apenas para listagens sem filtros dinâmicos
        $cacheKey = "workflow_executions_{$workflowId}_{$page}_{$perPage}";
        
        if (!$status) {
            return Cache::remember($cacheKey, 120, function () use ($workflowId, $perPage) {
                // Otimização: Usar repositório com eager loading
                $paginator = $this->executions->getAllPaginatedForWorkflow($workflowId, $perPage);
                return $paginator->toArray();
            });
        }
        
        // Sem cache para filtros dinâmicos - usar query builder otimizado
        $query = WorkflowExecutionModel::where('workflow_id', $workflowId);
        
        if ($status) {
            $query->where('status', $status);
        }
        
        // Otimização: Selecionar apenas campos necessários + eager loading
        $paginator = $query->select('id', 'workflow_id', 'status', 'payload', 'started_at', 'completed_at', 'created_at', 'updated_at')
            ->with(['workflow:id,name'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
        
        return $paginator->toArray();
    }

    /**
     * Get execution status
     */
    public function getExecutionStatus(int $executionId): ?array
    {
        $cacheKey = "workflow_execution_status_{$executionId}";
        
        return Cache::remember($cacheKey, 60, function () use ($executionId) {
            $execution = $this->executions->find($executionId);
            
            if (!$execution) {
                return null;
            }
            
            return [
                'id' => $execution->id,
                'status' => $execution->status,
                'started_at' => $execution->started_at,
                'completed_at' => $execution->completed_at,
            ];
        });
    }

    /**
     * Pause execution
     */
    public function pauseExecution(int $executionId): ?array
    {
        $execution = $this->executions->find($executionId);
        
        if (!$execution || !in_array($execution->status, ['running', 'pending'])) {
            return null;
        }

        $this->updateExecutionStatus($executionId, 'paused', [
            'paused_at' => now(),
            'paused_by' => Auth::id(),
        ]);

        // Limpar cache
        Cache::forget("workflow_execution_status_{$executionId}");

        return $this->getExecutionStatus($executionId);
    }

    /**
     * Resume execution
     */
    public function resumeExecution(int $executionId): ?array
    {
        $execution = $this->executions->find($executionId);
        
        if (!$execution || $execution->status !== 'paused') {
            return null;
        }

        $this->updateExecutionStatus($executionId, 'running', [
            'resumed_at' => now(),
            'resumed_by' => Auth::id(),
        ]);

        // Limpar cache
        Cache::forget("workflow_execution_status_{$executionId}");

        return $this->getExecutionStatus($executionId);
    }

    /**
     * Get execution logs
     */
    public function getExecutionLogs(int $executionId, array $filters = []): ?array
    {
        $execution = $this->executions->find($executionId);
        
        if (!$execution) {
            return null;
        }

        // Otimização: Buscar logs com limite
        $limit = $filters['limit'] ?? 50;
        
        $logs = DB::table('workflow_execution_nodes')
            ->where('execution_id', $executionId)
            ->orderBy('completed_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();

        return [
            'execution_id' => $executionId,
            'logs' => $logs,
            'total' => count($logs)
        ];
    }
}
