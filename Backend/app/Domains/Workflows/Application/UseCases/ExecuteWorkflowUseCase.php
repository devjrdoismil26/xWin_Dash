<?php

namespace App\Domains\Workflows\Application\UseCases;

use App\Domains\Workflows\Domain\Workflow;
use App\Domains\Workflows\Application\Commands\ExecuteWorkflowCommand;
use App\Domains\Workflows\Application\Handlers\ExecuteWorkflowHandler;
use App\Domains\Workflows\Application\Services\WorkflowsApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\WorkflowExecutedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para execução de workflows
 *
 * Orquestra a execução de um workflow,
 * incluindo validações, processamento e eventos.
 */
class ExecuteWorkflowUseCase
{
    private ExecuteWorkflowHandler $handler;
    private WorkflowsApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        ExecuteWorkflowHandler $handler,
        WorkflowsApplicationService $applicationService,
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Executa o use case de execução de workflow
     */
    public function execute(ExecuteWorkflowCommand $command): array
    {
        try {
            Log::info('Starting workflow execution use case', [
                'workflow_id' => $command->getWorkflowId(),
                'user_id' => $command->getUserId(),
                'execution_type' => $command->getExecutionType()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados da execução inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Buscar workflow
                $workflow = $this->applicationService->getWorkflowById($command->getWorkflowId());
                if (!$workflow) {
                    return [
                        'success' => false,
                        'errors' => ['Workflow não encontrado'],
                        'message' => 'Workflow não encontrado'
                    ];
                }

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validateWorkflowExecution($workflow, $this->applicationService->getUserById($command->getUserId()));
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Processar execução
                $result = $this->handler->handle($command);

                // Executar ações pós-execução
                $this->executePostExecutionActions($workflow, $command, $result);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($workflow, $command, $result);

                Log::info('Workflow executed successfully', [
                    'workflow_id' => $workflow->getId(),
                    'user_id' => $command->getUserId(),
                    'execution_id' => $result['execution_id'] ?? null,
                    'status' => $result['status'] ?? 'unknown'
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'workflow_id' => $workflow->getId(),
                        'execution_id' => $result['execution_id'] ?? null,
                        'status' => $result['status'] ?? 'completed',
                        'execution_time' => $result['execution_time'] ?? 0,
                        'executed_at' => now()->toISOString(),
                        'result' => $result
                    ],
                    'message' => 'Workflow executado com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in ExecuteWorkflowUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'workflow_id' => $command->getWorkflowId(),
                'user_id' => $command->getUserId()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante execução do workflow'],
                'message' => 'Falha ao executar workflow'
            ];
        }
    }

    /**
     * Valida o comando de execução
     */
    private function validateCommand(ExecuteWorkflowCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        if ($command->getWorkflowId() <= 0) {
            $errors[] = 'ID do workflow é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (empty($command->getExecutionType())) {
            $errors[] = 'Tipo de execução é obrigatório';
        }

        // Validar tipo de execução
        $validExecutionTypes = ['manual', 'triggered', 'scheduled', 'api'];
        if (!in_array($command->getExecutionType(), $validExecutionTypes)) {
            $errors[] = 'Tipo de execução inválido';
        }

        // Validar parâmetros
        if ($command->getParameters() && !is_array($command->getParameters())) {
            $errors[] = 'Parâmetros devem ser um array';
        }

        // Validar contexto
        if ($command->getContext() && !is_array($command->getContext())) {
            $errors[] = 'Contexto deve ser um array';
        }

        return $errors;
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(Workflow $workflow, int $userId): array
    {
        try {
            // Verificar se o workflow pertence ao usuário
            if ($workflow->getUserId() !== $userId) {
                return ['Workflow não pertence ao usuário'];
            }

            // Verificar se o workflow pode ser executado
            if (!$workflow->canBeExecuted()) {
                return ['Workflow não pode ser executado no status atual'];
            }

            // Validar limites do usuário
            $limitErrors = $this->validateUserLimits($userId);
            if (!empty($limitErrors)) {
                return $limitErrors;
            }

            // Validar recursos necessários
            $resourceErrors = $this->validateRequiredResources($workflow);
            if (!empty($resourceErrors)) {
                return $resourceErrors;
            }

            // Validar dependências
            $dependencyErrors = $this->validateDependencies($workflow);
            if (!empty($dependencyErrors)) {
                return $dependencyErrors;
            }

            // Validação bem-sucedida
            return [
                'valid' => true,
                'message' => 'Cross-module validation passed',
                'workflow_id' => $workflow->getId(),
                'user_id' => $userId,
                'validated_at' => now()->toISOString()
            ];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for workflow execution', [
                'error' => $exception->getMessage(),
                'workflow_id' => $workflow->getId(),
                'user_id' => $userId
            ]);

            return ['Erro durante validação cross-module'];
        }
    }

    /**
     * Valida limites do usuário
     */
    private function validateUserLimits(int $userId): array
    {
        $errors = [];

        // Verificar limite de execuções simultâneas
        $concurrentExecutionsCount = $this->applicationService->getConcurrentExecutionsCount($userId);
        $maxConcurrentExecutions = $this->applicationService->getUserMaxConcurrentExecutions($userId);

        if ($concurrentExecutionsCount >= $maxConcurrentExecutions) {
            $errors[] = "Usuário excedeu o limite de execuções simultâneas ({$maxConcurrentExecutions})";
        }

        // Verificar limite de execuções por hora
        $hourlyExecutionsCount = $this->applicationService->getHourlyExecutionsCount($userId);
        $maxHourlyExecutions = $this->applicationService->getUserMaxHourlyExecutions($userId);

        if ($hourlyExecutionsCount >= $maxHourlyExecutions) {
            $errors[] = "Usuário excedeu o limite de execuções por hora ({$maxHourlyExecutions})";
        }

        return $errors;
    }

    /**
     * Valida recursos necessários
     */
    private function validateRequiredResources(Workflow $workflow): array
    {
        $errors = [];

        // Verificar se o workflow tem definição válida
        if (!$workflow->getDefinition()) {
            $errors[] = 'Workflow não possui definição válida';
        }

        // Verificar se o workflow tem ações configuradas
        if (empty($workflow->getActions())) {
            $errors[] = 'Workflow não possui ações configuradas';
        }

        // Verificar se o workflow tem triggers configurados (se necessário)
        if ($workflow->getType() === 'trigger' && empty($workflow->getTriggers())) {
            $errors[] = 'Workflow do tipo trigger deve ter triggers configurados';
        }

        return $errors;
    }

    /**
     * Valida dependências
     */
    private function validateDependencies(Workflow $workflow): array
    {
        $errors = [];

        // Verificar dependências de integrações
        $integrationDependencies = $this->applicationService->getWorkflowIntegrationDependencies($workflow->getId());
        foreach ($integrationDependencies as $dependency) {
            if (!$this->applicationService->isIntegrationAvailable($dependency)) {
                $errors[] = "Integração '{$dependency}' não está disponível";
            }
        }

        // Verificar dependências de serviços
        $serviceDependencies = $this->applicationService->getWorkflowServiceDependencies($workflow->getId());
        foreach ($serviceDependencies as $dependency) {
            if (!$this->applicationService->isServiceAvailable($dependency)) {
                $errors[] = "Serviço '{$dependency}' não está disponível";
            }
        }

        return $errors;
    }

    /**
     * Executa ações pós-execução
     */
    private function executePostExecutionActions(Workflow $workflow, ExecuteWorkflowCommand $command, array $result): void
    {
        try {
            // Atualizar estatísticas do workflow
            $this->applicationService->updateWorkflowExecutionStats($workflow, $result);

            // Configurar analytics pós-execução
            $this->applicationService->setupWorkflowExecutionAnalytics($workflow, $result);

            // Configurar notificações pós-execução
            $this->applicationService->setupWorkflowExecutionNotifications($workflow, $result);

            // Configurar integrações pós-execução
            $this->applicationService->setupWorkflowExecutionIntegrations($workflow, $result);

            // Configurar webhooks pós-execução
            $this->applicationService->setupWorkflowExecutionWebhooks($workflow, $result);

            // Configurar monitoramento pós-execução
            $this->applicationService->setupWorkflowExecutionMonitoring($workflow, $result);

            // Configurar logs pós-execução
            $this->applicationService->setupWorkflowExecutionLogs($workflow, $result);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-execution actions', [
                'error' => $exception->getMessage(),
                'workflow_id' => $workflow->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(Workflow $workflow, ExecuteWorkflowCommand $command, array $result): void
    {
        try {
            $event = new WorkflowExecutedEvent(
                workflowId: $workflow->getId(),
                workflowName: $workflow->getName(),
                userId: $command->getUserId(),
                projectId: $workflow->getProjectId(),
                workflowType: $workflow->getType(),
                metadata: [
                    'execution_id' => $result['execution_id'] ?? null,
                    'execution_type' => $command->getExecutionType(),
                    'status' => $result['status'] ?? 'completed',
                    'execution_time' => $result['execution_time'] ?? 0,
                    'parameters' => $command->getParameters(),
                    'context' => $command->getContext(),
                    'source' => 'use_case',
                    'executed_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching workflow executed event', [
                'error' => $exception->getMessage(),
                'workflow_id' => $workflow->getId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'ExecuteWorkflowUseCase',
            'description' => 'Execução de workflows',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
