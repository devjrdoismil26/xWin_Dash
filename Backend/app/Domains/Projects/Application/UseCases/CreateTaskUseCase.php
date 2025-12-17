<?php

namespace App\Domains\Projects\Application\UseCases;

use App\Domains\Projects\Domain\Task;
use App\Domains\Projects\Application\Commands\CreateTaskCommand;
use App\Domains\Projects\Application\Handlers\CreateTaskHandler;
use App\Domains\Projects\Application\Services\ProjectsApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\TaskCreatedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para criação de tarefas
 *
 * Orquestra a criação de uma nova tarefa,
 * incluindo validações, persistência e eventos.
 */
class CreateTaskUseCase
{
    private CreateTaskHandler $handler;
    private ProjectsApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        CreateTaskHandler $handler,
        ProjectsApplicationService $applicationService,
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Executa o use case de criação de tarefa
     */
    public function execute(CreateTaskCommand $command): array
    {
        try {
            Log::info('Starting task creation use case', [
                'user_id' => $command->getUserId(),
                'project_id' => $command->getProjectId(),
                'task_title' => $command->getTitle()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados da tarefa inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Criar entidade de domínio
                $task = $this->createTaskEntity($command);

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validateTaskCreation($task, $this->applicationService->getUserById($command->getUserId()));
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Persistir tarefa
                $savedTask = $this->handler->handle($command);

                // Executar ações pós-criação
                $this->executePostCreationActions($savedTask, $command);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($savedTask, $command);

                Log::info('Task created successfully', [
                    'task_id' => $savedTask->getId(),
                    'user_id' => $command->getUserId(),
                    'project_id' => $command->getProjectId(),
                    'task_title' => $savedTask->getTitle()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'task' => $savedTask->toArray(),
                        'task_id' => $savedTask->getId()
                    ],
                    'message' => 'Tarefa criada com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in CreateTaskUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'project_id' => $command->getProjectId(),
                'task_title' => $command->getTitle()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação da tarefa'],
                'message' => 'Falha ao criar tarefa'
            ];
        }
    }

    /**
     * Valida o comando de criação
     */
    private function validateCommand(CreateTaskCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        if (empty($command->getTitle())) {
            $errors[] = 'Título da tarefa é obrigatório';
        }

        if ($command->getProjectId() <= 0) {
            $errors[] = 'ID do projeto é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        // Validar formato do título
        if (strlen($command->getTitle()) < 3) {
            $errors[] = 'Título da tarefa deve ter pelo menos 3 caracteres';
        }

        if (strlen($command->getTitle()) > 200) {
            $errors[] = 'Título da tarefa deve ter no máximo 200 caracteres';
        }

        // Validar prioridade
        $validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (!in_array($command->getPriority(), $validPriorities)) {
            $errors[] = 'Prioridade inválida';
        }

        // Validar status
        $validStatuses = ['todo', 'in_progress', 'review', 'done', 'cancelled'];
        if (!in_array($command->getStatus(), $validStatuses)) {
            $errors[] = 'Status inválido';
        }

        // Validar datas
        if ($command->getStartDate() && $command->getDueDate() && $command->getStartDate() > $command->getDueDate()) {
            $errors[] = 'Data de início não pode ser posterior à data de vencimento';
        }

        // Validar estimativa
        if ($command->getEstimatedHours() !== null && $command->getEstimatedHours() < 0) {
            $errors[] = 'Estimativa de horas não pode ser negativa';
        }

        // Validar progresso
        if ($command->getProgress() < 0 || $command->getProgress() > 100) {
            $errors[] = 'Progresso deve estar entre 0 e 100';
        }

        return $errors;
    }

    /**
     * Cria entidade de domínio
     */
    private function createTaskEntity(CreateTaskCommand $command): Task
    {
        return new Task(
            title: $command->getTitle(),
            projectId: $command->getProjectId(),
            userId: $command->getUserId(),
            description: $command->getDescription(),
            status: $command->getStatus(),
            priority: $command->getPriority(),
            type: $command->getType(),
            tags: $command->getTags(),
            metadata: $command->getMetadata(),
            startDate: $command->getStartDate(),
            dueDate: $command->getDueDate(),
            completedDate: $command->getCompletedDate(),
            estimatedHours: $command->getEstimatedHours(),
            actualHours: $command->getActualHours(),
            progress: $command->getProgress(),
            assignedTo: $command->getAssignedTo(),
            parentTaskId: $command->getParentTaskId(),
            dependencies: $command->getDependencies(),
            attachments: $command->getAttachments(),
            customFields: $command->getCustomFields()
        );
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(Task $task, int $userId): array
    {
        try {
            // Buscar usuário para validação
            $user = $this->applicationService->getUserById($userId);
            if (!$user) {
                return ['Usuário não encontrado'];
            }

            // Validar projeto
            $projectErrors = $this->validateProject($task->getProjectId(), $userId);
            if (!empty($projectErrors)) {
                return $projectErrors;
            }

            // Validar limites do usuário
            $limitErrors = $this->validateUserLimits($userId);
            if (!empty($limitErrors)) {
                return $limitErrors;
            }

            // Validar tarefa pai se fornecida
            if ($task->getParentTaskId()) {
                $parentErrors = $this->validateParentTask($task->getParentTaskId(), $task->getProjectId());
                if (!empty($parentErrors)) {
                    return $parentErrors;
                }
            }

            // Validar dependências
            $dependencyErrors = $this->validateDependencies($task->getDependencies(), $task->getProjectId());
            if (!empty($dependencyErrors)) {
                return $dependencyErrors;
            }

            // Validação bem-sucedida
            return [
                'valid' => true,
                'message' => 'Cross-module validation passed',
                'user_id' => $userId,
                'project_id' => $task->getProjectId(),
                'task_title' => $task->getTitle(),
                'validated_at' => now()->toISOString()
            ];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for task', [
                'error' => $exception->getMessage(),
                'user_id' => $userId
            ]);

            return ['Erro durante validação cross-module'];
        }
    }

    /**
     * Valida projeto
     */
    private function validateProject(int $projectId, int $userId): array
    {
        $project = $this->applicationService->getProjectById($projectId);

        if (!$project) {
            return ['Projeto não encontrado'];
        }

        if ($project->getUserId() !== $userId) {
            return ['Projeto não pertence ao usuário'];
        }

        if (!$project->isActive()) {
            return ['Projeto não está ativo'];
        }

        // Validação bem-sucedida
        return [
            'valid' => true,
            'message' => 'Project validation passed',
            'project_id' => $projectId,
            'project_name' => $project->getName()
        ];
    }

    /**
     * Valida limites do usuário
     */
    private function validateUserLimits(int $userId): array
    {
        $errors = [];

        // Verificar limite de tarefas ativas
        $activeTasksCount = $this->applicationService->getActiveTasksCount($userId);
        $maxActiveTasks = $this->applicationService->getUserMaxActiveTasks($userId);

        if ($activeTasksCount >= $maxActiveTasks) {
            $errors[] = "Usuário excedeu o limite de tarefas ativas ({$maxActiveTasks})";
        }

        return $errors;
    }

    /**
     * Valida tarefa pai
     */
    private function validateParentTask(?int $parentTaskId, int $projectId): array
    {
        if (!$parentTaskId) {
            return [
                'valid' => true,
                'message' => 'No parent task specified'
            ];
        }

        $parentTask = $this->applicationService->getTaskById($parentTaskId);

        if (!$parentTask) {
            return ['Tarefa pai não encontrada'];
        }

        if ($parentTask->getProjectId() !== $projectId) {
            return ['Tarefa pai não pertence ao mesmo projeto'];
        }

        if (!$parentTask->isActive()) {
            return ['Tarefa pai não está ativa'];
        }

        // Verificar se não criaria loop (tarefa dentro de si mesma)
        if ($this->wouldCreateLoop($parentTaskId, $projectId)) {
            return ['Não é possível criar tarefa dentro de si mesma'];
        }

        // Validação bem-sucedida
        return [
            'valid' => true,
            'message' => 'Parent task validation passed',
            'parent_task_id' => $parentTaskId,
            'parent_task_title' => $parentTask->getTitle()
        ];
    }

    /**
     * Verifica se criaria loop na hierarquia
     */
    private function wouldCreateLoop(int $parentTaskId, int $projectId): bool
    {
        // Implementar verificação de loop na hierarquia
        // Por enquanto, retornar false
        return false;
    }

    /**
     * Valida dependências
     */
    private function validateDependencies(array $dependencies, int $projectId): array
    {
        $errors = [];

        foreach ($dependencies as $dependencyId) {
            $dependency = $this->applicationService->getTaskById($dependencyId);

            if (!$dependency) {
                $errors[] = "Tarefa dependência ID {$dependencyId} não encontrada";
                continue;
            }

            if ($dependency->getProjectId() !== $projectId) {
                $errors[] = "Tarefa dependência ID {$dependencyId} não pertence ao mesmo projeto";
                continue;
            }

            if (!$dependency->isActive()) {
                $errors[] = "Tarefa dependência ID {$dependencyId} não está ativa";
            }
        }

        return $errors;
    }

    /**
     * Executa ações pós-criação
     */
    private function executePostCreationActions(Task $task, CreateTaskCommand $command): void
    {
        try {
            // Configurar tarefa inicial
            $this->applicationService->configureInitialTaskSettings($task);

            // Configurar notificações
            $this->applicationService->setupTaskNotifications($task);

            // Configurar analytics
            $this->applicationService->setupTaskAnalytics($task);

            // Configurar integrações
            $this->applicationService->setupTaskIntegrations($task);

            // Atualizar contadores do projeto
            $this->applicationService->updateProjectTaskCounters($task->getProjectId());
        } catch (\Throwable $exception) {
            Log::error('Error executing post-creation actions for task', [
                'error' => $exception->getMessage(),
                'task_id' => $task->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(Task $task, CreateTaskCommand $command): void
    {
        try {
            $event = new TaskCreatedEvent(
                taskId: $task->getId(),
                taskTitle: $task->getTitle(),
                projectId: $task->getProjectId(),
                userId: $command->getUserId(),
                metadata: [
                    'priority' => $task->getPriority(),
                    'status' => $task->getStatus(),
                    'assigned_to' => $task->getAssignedTo(),
                    'estimated_hours' => $task->getEstimatedHours(),
                    'source' => 'use_case',
                    'created_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching task created event', [
                'error' => $exception->getMessage(),
                'task_id' => $task->getId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'CreateTaskUseCase',
            'description' => 'Criação de tarefas',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
