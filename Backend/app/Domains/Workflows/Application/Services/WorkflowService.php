<?php

namespace App\Domains\Workflows\Application\Services;

use App\Domains\Workflows\Application\UseCases\CreateWorkflowUseCase;
use App\Domains\Workflows\Application\UseCases\UpdateWorkflowUseCase;
use App\Domains\Workflows\Application\UseCases\DeleteWorkflowUseCase;
use App\Domains\Workflows\Application\UseCases\GetWorkflowUseCase;
use App\Domains\Workflows\Application\UseCases\ListWorkflowsUseCase;
use App\Domains\Workflows\Application\Commands\CreateWorkflowCommand;
use App\Domains\Workflows\Application\Commands\UpdateWorkflowCommand;
use App\Domains\Workflows\Application\Commands\DeleteWorkflowCommand;
use App\Domains\Workflows\Application\Queries\GetWorkflowQuery;
use App\Domains\Workflows\Application\Queries\ListWorkflowsQuery;
use App\Domains\Workflows\Domain\Workflow;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Service especializado para operações de workflows
 *
 * Responsável por gerenciar workflows, incluindo
 * criação, atualização, exclusão e listagem.
 */
class WorkflowService
{
    private CreateWorkflowUseCase $createWorkflowUseCase;
    private UpdateWorkflowUseCase $updateWorkflowUseCase;
    private DeleteWorkflowUseCase $deleteWorkflowUseCase;
    private GetWorkflowUseCase $getWorkflowUseCase;
    private ListWorkflowsUseCase $listWorkflowsUseCase;

    public function __construct(
        CreateWorkflowUseCase $createWorkflowUseCase,
        UpdateWorkflowUseCase $updateWorkflowUseCase,
        DeleteWorkflowUseCase $deleteWorkflowUseCase,
        GetWorkflowUseCase $getWorkflowUseCase,
        ListWorkflowsUseCase $listWorkflowsUseCase
    ) {
        $this->createWorkflowUseCase = $createWorkflowUseCase;
        $this->updateWorkflowUseCase = $updateWorkflowUseCase;
        $this->deleteWorkflowUseCase = $deleteWorkflowUseCase;
        $this->getWorkflowUseCase = $getWorkflowUseCase;
        $this->listWorkflowsUseCase = $listWorkflowsUseCase;
    }

    /**
     * Cria um novo workflow
     */
    public function create(array $data): array
    {
        try {
            $command = CreateWorkflowCommand::fromArray($data);
            return $this->createWorkflowUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in WorkflowService::create', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação do workflow'],
                'message' => 'Falha ao criar workflow'
            ];
        }
    }

    /**
     * Atualiza um workflow
     */
    public function update(int $workflowId, array $data): array
    {
        try {
            $command = UpdateWorkflowCommand::fromArray(array_merge($data, ['workflow_id' => $workflowId]));
            return $this->updateWorkflowUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in WorkflowService::update', [
                'error' => $exception->getMessage(),
                'workflow_id' => $workflowId,
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atualização do workflow'],
                'message' => 'Falha ao atualizar workflow'
            ];
        }
    }

    /**
     * Remove um workflow
     */
    public function delete(int $workflowId, int $userId): array
    {
        try {
            $command = new DeleteWorkflowCommand($workflowId, $userId);
            return $this->deleteWorkflowUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in WorkflowService::delete', [
                'error' => $exception->getMessage(),
                'workflow_id' => $workflowId,
                'user_id' => $userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante exclusão do workflow'],
                'message' => 'Falha ao excluir workflow'
            ];
        }
    }

    /**
     * Obtém um workflow específico
     */
    public function get(int $workflowId, int $userId, array $options = []): array
    {
        try {
            $query = new GetWorkflowQuery($workflowId, $userId, $options);
            return $this->getWorkflowUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in WorkflowService::get', [
                'error' => $exception->getMessage(),
                'workflow_id' => $workflowId,
                'user_id' => $userId,
                'options' => $options
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante busca do workflow'],
                'message' => 'Falha ao buscar workflow'
            ];
        }
    }

    /**
     * Lista workflows do usuário
     */
    public function list(int $userId, array $filters = []): array
    {
        try {
            $query = new ListWorkflowsQuery($userId, $filters);
            return $this->listWorkflowsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in WorkflowService::list', [
                'error' => $exception->getMessage(),
                'user_id' => $userId,
                'filters' => $filters
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante listagem dos workflows'],
                'message' => 'Falha ao listar workflows'
            ];
        }
    }

    /**
     * Obtém um workflow por ID (método auxiliar)
     */
    public function getById(int $workflowId): ?Workflow
    {
        $cacheKey = "workflow_{$workflowId}";

        return Cache::remember($cacheKey, 300, function () use ($workflowId) {
            return Workflow::find($workflowId);
        });
    }

    /**
     * Conta workflows ativos do usuário
     */
    public function getActiveCount(int $userId): int
    {
        $cacheKey = "workflow_active_count_{$userId}";

        return Cache::remember($cacheKey, 300, function () use ($userId) {
            return Workflow::where('user_id', $userId)
                ->where('status', 'active')
                ->count();
        });
    }

    /**
     * Obtém limite máximo de workflows do usuário
     */
    public function getUserMaxWorkflows(int $userId): int
    {
        $user = \App\Domains\Users\Domain\User::find($userId);

        if (!$user) {
            return 0;
        }

        // Lógica baseada no plano do usuário
        return match ($user->plan) {
            'free' => 5,
            'basic' => 20,
            'premium' => 100,
            'enterprise' => 500,
            default => 5
        };
    }

    /**
     * Conta execuções concorrentes do usuário
     */
    public function getConcurrentExecutionsCount(int $userId): int
    {
        $cacheKey = "workflow_concurrent_executions_{$userId}";

        return Cache::remember($cacheKey, 60, function () use ($userId) {
            return \App\Domains\Workflows\Models\WorkflowExecution::where('user_id', $userId)
                ->where('status', 'running')
                ->count();
        });
    }

    /**
     * Obtém limite máximo de execuções concorrentes do usuário
     */
    public function getUserMaxConcurrentExecutions(int $userId): int
    {
        $user = \App\Domains\Users\Domain\User::find($userId);

        if (!$user) {
            return 0;
        }

        // Lógica baseada no plano do usuário
        return match ($user->plan) {
            'free' => 2,
            'basic' => 5,
            'premium' => 20,
            'enterprise' => 100,
            default => 2
        };
    }

    /**
     * Conta execuções por hora do usuário
     */
    public function getHourlyExecutionsCount(int $userId): int
    {
        $cacheKey = "workflow_hourly_executions_{$userId}_" . date('Y-m-d-H');

        return Cache::remember($cacheKey, 300, function () use ($userId) {
            return \App\Domains\Workflows\Models\WorkflowExecution::where('user_id', $userId)
                ->where('created_at', '>=', now()->subHour())
                ->count();
        });
    }

    /**
     * Obtém limite máximo de execuções por hora do usuário
     */
    public function getUserMaxHourlyExecutions(int $userId): int
    {
        $user = \App\Domains\Users\Domain\User::find($userId);

        if (!$user) {
            return 0;
        }

        // Lógica baseada no plano do usuário
        return match ($user->plan) {
            'free' => 10,
            'basic' => 50,
            'premium' => 200,
            'enterprise' => 1000,
            default => 10
        };
    }
}
