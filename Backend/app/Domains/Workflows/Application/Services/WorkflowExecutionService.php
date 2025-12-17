<?php

namespace App\Domains\Workflows\Application\Services;

use App\Domains\Workflows\Application\UseCases\ExecuteWorkflowUseCase;
use App\Domains\Workflows\Application\Commands\ExecuteWorkflowCommand;
use App\Domains\Workflows\Domain\Workflow;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Service especializado para execução de workflows
 *
 * Responsável por executar workflows, incluindo
 * validações, monitoramento e controle de execução.
 */
class WorkflowExecutionService
{
    private ExecuteWorkflowUseCase $executeWorkflowUseCase;

    public function __construct(
        ExecuteWorkflowUseCase $executeWorkflowUseCase
    ) {
        $this->executeWorkflowUseCase = $executeWorkflowUseCase;
    }

    /**
     * Executa um workflow
     */
    public function execute(array $data): array
    {
        try {
            $command = ExecuteWorkflowCommand::fromArray($data);
            return $this->executeWorkflowUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in WorkflowExecutionService::execute', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante execução do workflow'],
                'message' => 'Falha ao executar workflow'
            ];
        }
    }

    /**
     * Verifica se uma integração está disponível
     */
    public function isIntegrationAvailable(string $integration): bool
    {
        $cacheKey = "integration_available_{$integration}";

        return Cache::remember($cacheKey, 300, function () use ($integration) {
            // Verificar se a integração está configurada e ativa
            $integrationConfig = config("integrations.{$integration}");

            if (!$integrationConfig) {
                return false;
            }

            // Verificar se as credenciais estão configuradas
            $requiredCredentials = $integrationConfig['required_credentials'] ?? [];

            foreach ($requiredCredentials as $credential) {
                if (empty(config("services.{$integration}.{$credential}"))) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Verifica se um serviço está disponível
     */
    public function isServiceAvailable(string $service): bool
    {
        $cacheKey = "service_available_{$service}";

        return Cache::remember($cacheKey, 300, function () use ($service) {
            // Verificar se o serviço está configurado
            $serviceConfig = config("services.{$service}");

            if (!$serviceConfig) {
                return false;
            }

            // Verificar se o serviço está ativo
            return $serviceConfig['enabled'] ?? false;
        });
    }

    /**
     * Valida se um workflow pode ser executado
     */
    public function canExecuteWorkflow(int $workflowId, int $userId): array
    {
        $workflow = Workflow::find($workflowId);

        if (!$workflow) {
            return [
                'can_execute' => false,
                'reason' => 'Workflow não encontrado'
            ];
        }

        if ($workflow->user_id !== $userId) {
            return [
                'can_execute' => false,
                'reason' => 'Usuário não tem permissão para executar este workflow'
            ];
        }

        if ($workflow->status !== 'active') {
            return [
                'can_execute' => false,
                'reason' => 'Workflow não está ativo'
            ];
        }

        // Verificar limites de execução
        $concurrentExecutions = $this->getConcurrentExecutionsCount($userId);
        $maxConcurrent = $this->getUserMaxConcurrentExecutions($userId);

        if ($concurrentExecutions >= $maxConcurrent) {
            return [
                'can_execute' => false,
                'reason' => 'Limite de execuções concorrentes atingido'
            ];
        }

        $hourlyExecutions = $this->getHourlyExecutionsCount($userId);
        $maxHourly = $this->getUserMaxHourlyExecutions($userId);

        if ($hourlyExecutions >= $maxHourly) {
            return [
                'can_execute' => false,
                'reason' => 'Limite de execuções por hora atingido'
            ];
        }

        return [
            'can_execute' => true,
            'reason' => null
        ];
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

        return match ($user->plan) {
            'free' => 10,
            'basic' => 50,
            'premium' => 200,
            'enterprise' => 1000,
            default => 10
        };
    }

    /**
     * Obtém estatísticas de execução
     */
    public function getExecutionStats(int $workflowId): array
    {
        $cacheKey = "workflow_execution_stats_{$workflowId}";

        return Cache::remember($cacheKey, 300, function () use ($workflowId) {
            $executions = \App\Domains\Workflows\Models\WorkflowExecution::where('workflow_id', $workflowId);

            return [
                'total_executions' => $executions->count(),
                'successful_executions' => $executions->where('status', 'completed')->count(),
                'failed_executions' => $executions->where('status', 'failed')->count(),
                'running_executions' => $executions->where('status', 'running')->count(),
                'average_execution_time' => $executions->where('status', 'completed')->avg('execution_time'),
                'last_execution' => $executions->latest()->first()?->created_at
            ];
        });
    }
}
