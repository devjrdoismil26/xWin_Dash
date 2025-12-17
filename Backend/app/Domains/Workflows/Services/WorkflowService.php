<?php

namespace App\Domains\Workflows\Services;

use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionRepository;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel as EloquentWorkflow;
use App\Domains\Workflows\Notifications\WorkflowStatusNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class WorkflowService
{
    public function __construct(
        protected EloquentWorkflow $workflowModel,
        protected WorkflowExecutionRepository $executionRepository,
    ) {
    }

    /**
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator<\App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel>
     */
    public function getAllWorkflows(int $userId, int $perPage = 15)
    {
        // Cache de 2 minutos para listagem de workflows
        $cacheKey = "workflows_list_{$userId}_{$perPage}_" . request()->get('page', 1);
        
        return Cache::remember($cacheKey, 120, function () use ($userId, $perPage) {
            // Otimização: Eager loading de relacionamentos comuns
            return $this->workflowModel
                ->where('user_id', $userId)
                ->with(['nodes', 'executions' => function ($query) {
                    $query->latest()->limit(5); // Apenas últimas 5 execuções
                }])
                ->orderBy('updated_at', 'desc')
                ->paginate($perPage);
        });
    }

    /**
     * @param array<string, mixed> $data
     * @return \App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel
     */
    public function createWorkflow(int $userId, array $data)
    {
        $data['user_id'] = $userId;
        return $this->workflowModel->create($data);
    }

    /**
     * @param string|int $id
     * @return \App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel|null
     */
    public function getWorkflowById($id): ?\App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel
    {
        // Convert string to int if needed
        $workflowId = is_numeric($id) ? (int) $id : $id;
        return $this->workflowModel->find($workflowId);
    }

    /**
     * @param array<string, mixed> $initialPayload
     */
    public function startWorkflow(int $workflowId, array $initialPayload = []): object
    {
        try {
            $execution = $this->executionRepository->create([
                'workflow_id' => $workflowId,
                'status' => 'running',
                'payload' => $initialPayload,
                'user_id' => Auth::id(),
            ]);

            $userId = Auth::id();
            if (class_exists('App\\Domains\\Workflows\\Jobs\\ProcessWorkflowJob')) {
                dispatch(new \App\Domains\Workflows\Jobs\ProcessWorkflowJob($workflowId, $initialPayload, $userId));
            }

            return $execution;
        } catch (\Throwable $e) {
            Log::error('Failed to start workflow', ['workflowId' => $workflowId, 'error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * @return mixed
     */
    public function getWorkflowExecutionById(int $executionId)
    {
        return $this->executionRepository->find($executionId);
    }

    /**
     * Atualiza o status de um workflow
     *
     * @return \App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel
     */
    public function updateWorkflowStatus(int $workflowId, string $status, ?string $errorMessage = null)
    {
        $workflow = $this->getWorkflowById($workflowId);
        $oldStatus = $workflow->status;

        $workflow->update(['status' => $status]);

        // Enviar notificação se o status mudou e há um usuário autenticado
        if ($oldStatus !== $status && Auth::check()) {
            $user = Auth::user();
            $user->notify(new WorkflowStatusNotification($workflow, $oldStatus, $status, $errorMessage));
        }

        return $workflow;
    }

    /**
     * Atualiza um workflow
     *
     * @param array<string, mixed> $data
     * @return \App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel|null
     */
    public function updateWorkflow(int $workflowId, array $data)
    {
        try {
            $workflow = $this->getWorkflowById($workflowId);
            $workflow->update($data);
            return $workflow;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Deleta um workflow
     */
    public function deleteWorkflow(int $workflowId): bool
    {
        try {
            $workflow = $this->getWorkflowById($workflowId);
            return (bool) $workflow->delete();
        } catch (\Exception $e) {
            return false;
        }
    }
}
