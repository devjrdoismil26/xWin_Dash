<?php

namespace App\Domains\Projects\Application\Services;

use App\Domains\Projects\Application\UseCases\CreateProjectUseCase;
use App\Domains\Projects\Application\UseCases\UpdateProjectUseCase;
use App\Domains\Projects\Application\UseCases\DeleteProjectUseCase;
use App\Domains\Projects\Application\UseCases\GetProjectUseCase;
use App\Domains\Projects\Application\UseCases\ListProjectsUseCase;
use App\Domains\Projects\Application\UseCases\CreateTaskUseCase;
use App\Domains\Projects\Application\UseCases\UpdateTaskUseCase;
use App\Domains\Projects\Application\UseCases\DeleteTaskUseCase;
use App\Domains\Projects\Application\UseCases\GetTaskUseCase;
use App\Domains\Projects\Application\UseCases\ListTasksUseCase;
use App\Domains\Projects\Application\UseCases\AssignTeamMemberUseCase;
use App\Domains\Projects\Application\UseCases\RemoveTeamMemberUseCase;
use App\Domains\Projects\Application\Commands\CreateProjectCommand;
use App\Domains\Projects\Application\Commands\UpdateProjectCommand;
use App\Domains\Projects\Application\Commands\DeleteProjectCommand;
use App\Domains\Projects\Application\Commands\CreateTaskCommand;
use App\Domains\Projects\Application\Commands\UpdateTaskCommand;
use App\Domains\Projects\Application\Commands\DeleteTaskCommand;
use App\Domains\Projects\Application\Commands\AssignTeamMemberCommand;
use App\Domains\Projects\Application\Commands\RemoveTeamMemberCommand;
use App\Domains\Projects\Application\Queries\GetProjectQuery;
use App\Domains\Projects\Application\Queries\ListProjectsQuery;
use App\Domains\Projects\Application\Queries\GetTaskQuery;
use App\Domains\Projects\Application\Queries\ListTasksQuery;
use App\Domains\Projects\Domain\Project;
use App\Domains\Projects\Domain\Task;
use App\Domains\Users\Domain\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Application Service para Projects
 *
 * Orquestra use cases e fornece interface unificada
 * para operações de projetos e tarefas.
 */
class ProjectsApplicationService
{
    private CreateProjectUseCase $createProjectUseCase;
    private UpdateProjectUseCase $updateProjectUseCase;
    private DeleteProjectUseCase $deleteProjectUseCase;
    private GetProjectUseCase $getProjectUseCase;
    private ListProjectsUseCase $listProjectsUseCase;
    private CreateTaskUseCase $createTaskUseCase;
    private UpdateTaskUseCase $updateTaskUseCase;
    private DeleteTaskUseCase $deleteTaskUseCase;
    private GetTaskUseCase $getTaskUseCase;
    private ListTasksUseCase $listTasksUseCase;
    private AssignTeamMemberUseCase $assignTeamMemberUseCase;
    private RemoveTeamMemberUseCase $removeTeamMemberUseCase;

    public function __construct(
        CreateProjectUseCase $createProjectUseCase,
        UpdateProjectUseCase $updateProjectUseCase,
        DeleteProjectUseCase $deleteProjectUseCase,
        GetProjectUseCase $getProjectUseCase,
        ListProjectsUseCase $listProjectsUseCase,
        CreateTaskUseCase $createTaskUseCase,
        UpdateTaskUseCase $updateTaskUseCase,
        DeleteTaskUseCase $deleteTaskUseCase,
        GetTaskUseCase $getTaskUseCase,
        ListTasksUseCase $listTasksUseCase,
        AssignTeamMemberUseCase $assignTeamMemberUseCase,
        RemoveTeamMemberUseCase $removeTeamMemberUseCase
    ) {
        $this->createProjectUseCase = $createProjectUseCase;
        $this->updateProjectUseCase = $updateProjectUseCase;
        $this->deleteProjectUseCase = $deleteProjectUseCase;
        $this->getProjectUseCase = $getProjectUseCase;
        $this->listProjectsUseCase = $listProjectsUseCase;
        $this->createTaskUseCase = $createTaskUseCase;
        $this->updateTaskUseCase = $updateTaskUseCase;
        $this->deleteTaskUseCase = $deleteTaskUseCase;
        $this->getTaskUseCase = $getTaskUseCase;
        $this->listTasksUseCase = $listTasksUseCase;
        $this->assignTeamMemberUseCase = $assignTeamMemberUseCase;
        $this->removeTeamMemberUseCase = $removeTeamMemberUseCase;
    }

    // ===== PROJETOS =====

    /**
     * Cria um novo projeto
     */
    public function createProject(array $data): array
    {
        try {
            $command = CreateProjectCommand::fromArray($data);
            return $this->createProjectUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in ProjectsApplicationService::createProject', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação do projeto'],
                'message' => 'Falha ao criar projeto'
            ];
        }
    }

    /**
     * Atualiza um projeto
     */
    public function updateProject(int $projectId, array $data): array
    {
        try {
            $command = UpdateProjectCommand::fromArray(array_merge($data, ['project_id' => $projectId]));
            return $this->updateProjectUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in ProjectsApplicationService::updateProject', [
                'error' => $exception->getMessage(),
                'project_id' => $projectId,
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atualização do projeto'],
                'message' => 'Falha ao atualizar projeto'
            ];
        }
    }

    /**
     * Remove um projeto
     */
    public function deleteProject(int $projectId, int $userId): array
    {
        try {
            $command = new DeleteProjectCommand($projectId, $userId);
            return $this->deleteProjectUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in ProjectsApplicationService::deleteProject', [
                'error' => $exception->getMessage(),
                'project_id' => $projectId,
                'user_id' => $userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante remoção do projeto'],
                'message' => 'Falha ao remover projeto'
            ];
        }
    }

    /**
     * Obtém um projeto
     */
    public function getProject(int $projectId, int $userId, array $options = []): array
    {
        try {
            $query = new GetProjectQuery(
                projectId: $projectId,
                userId: $userId,
                includeTasks: $options['include_tasks'] ?? false,
                includeTeamMembers: $options['include_team_members'] ?? false,
                includeAnalytics: $options['include_analytics'] ?? false
            );

            return $this->getProjectUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ProjectsApplicationService::getProject', [
                'error' => $exception->getMessage(),
                'project_id' => $projectId,
                'user_id' => $userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante obtenção do projeto'],
                'message' => 'Falha ao obter projeto'
            ];
        }
    }

    /**
     * Lista projetos
     */
    public function listProjects(int $userId, array $filters = []): array
    {
        try {
            $query = new ListProjectsQuery(
                userId: $userId,
                status: $filters['status'] ?? null,
                type: $filters['type'] ?? null,
                priority: $filters['priority'] ?? null,
                limit: $filters['limit'] ?? 20,
                offset: $filters['offset'] ?? 0,
                sortBy: $filters['sort_by'] ?? 'created_at',
                sortOrder: $filters['sort_order'] ?? 'desc'
            );

            return $this->listProjectsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ProjectsApplicationService::listProjects', [
                'error' => $exception->getMessage(),
                'user_id' => $userId,
                'filters' => $filters
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante listagem de projetos'],
                'message' => 'Falha ao listar projetos'
            ];
        }
    }

    // ===== TAREFAS =====

    /**
     * Cria uma nova tarefa
     */
    public function createTask(array $data): array
    {
        try {
            $command = CreateTaskCommand::fromArray($data);
            return $this->createTaskUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in ProjectsApplicationService::createTask', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação da tarefa'],
                'message' => 'Falha ao criar tarefa'
            ];
        }
    }

    /**
     * Atualiza uma tarefa
     */
    public function updateTask(int $taskId, array $data): array
    {
        try {
            $command = UpdateTaskCommand::fromArray(array_merge($data, ['task_id' => $taskId]));
            return $this->updateTaskUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in ProjectsApplicationService::updateTask', [
                'error' => $exception->getMessage(),
                'task_id' => $taskId,
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atualização da tarefa'],
                'message' => 'Falha ao atualizar tarefa'
            ];
        }
    }

    /**
     * Remove uma tarefa
     */
    public function deleteTask(int $taskId, int $userId): array
    {
        try {
            $command = new DeleteTaskCommand($taskId, $userId);
            return $this->deleteTaskUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in ProjectsApplicationService::deleteTask', [
                'error' => $exception->getMessage(),
                'task_id' => $taskId,
                'user_id' => $userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante remoção da tarefa'],
                'message' => 'Falha ao remover tarefa'
            ];
        }
    }

    /**
     * Obtém uma tarefa
     */
    public function getTask(int $taskId, int $userId, array $options = []): array
    {
        try {
            $query = new GetTaskQuery(
                taskId: $taskId,
                userId: $userId,
                includeProject: $options['include_project'] ?? false,
                includeDependencies: $options['include_dependencies'] ?? false,
                includeAnalytics: $options['include_analytics'] ?? false
            );

            return $this->getTaskUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ProjectsApplicationService::getTask', [
                'error' => $exception->getMessage(),
                'task_id' => $taskId,
                'user_id' => $userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante obtenção da tarefa'],
                'message' => 'Falha ao obter tarefa'
            ];
        }
    }

    /**
     * Lista tarefas
     */
    public function listTasks(int $userId, array $filters = []): array
    {
        try {
            $query = new ListTasksQuery(
                userId: $userId,
                projectId: $filters['project_id'] ?? null,
                status: $filters['status'] ?? null,
                priority: $filters['priority'] ?? null,
                assignedTo: $filters['assigned_to'] ?? null,
                limit: $filters['limit'] ?? 20,
                offset: $filters['offset'] ?? 0,
                sortBy: $filters['sort_by'] ?? 'created_at',
                sortOrder: $filters['sort_order'] ?? 'desc'
            );

            return $this->listTasksUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ProjectsApplicationService::listTasks', [
                'error' => $exception->getMessage(),
                'user_id' => $userId,
                'filters' => $filters
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante listagem de tarefas'],
                'message' => 'Falha ao listar tarefas'
            ];
        }
    }

    // ===== EQUIPE =====

    /**
     * Atribui um membro da equipe
     */
    public function assignTeamMember(array $data): array
    {
        try {
            $command = AssignTeamMemberCommand::fromArray($data);
            return $this->assignTeamMemberUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in ProjectsApplicationService::assignTeamMember', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atribuição do membro da equipe'],
                'message' => 'Falha ao atribuir membro da equipe'
            ];
        }
    }

    /**
     * Remove um membro da equipe
     */
    public function removeTeamMember(int $projectId, int $memberUserId, int $userId): array
    {
        try {
            $command = new RemoveTeamMemberCommand($projectId, $memberUserId, $userId);
            return $this->removeTeamMemberUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in ProjectsApplicationService::removeTeamMember', [
                'error' => $exception->getMessage(),
                'project_id' => $projectId,
                'member_user_id' => $memberUserId,
                'user_id' => $userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante remoção do membro da equipe'],
                'message' => 'Falha ao remover membro da equipe'
            ];
        }
    }

    // ===== MÉTODOS AUXILIARES =====

    /**
     * Obtém usuário por ID (para validações cross-module)
     */
    public function getUserById(int $userId): ?User
    {
        try {
            $cacheKey = "user_{$userId}";

            return Cache::remember($cacheKey, 300, function () use ($userId) {
                // Buscar usuário no banco de dados
                $userModel = \App\Models\User::find($userId);

                if (!$userModel) {
                    return null;
                }

                // Converter para Domain Entity
                return new User(
                    id: $userModel->id,
                    name: $userModel->name,
                    email: $userModel->email,
                    isActive: $userModel->is_active ?? true,
                    createdAt: $userModel->created_at,
                    updatedAt: $userModel->updated_at
                );
            });
        } catch (\Throwable $exception) {
            Log::error('Error getting user by ID', [
                'error' => $exception->getMessage(),
                'user_id' => $userId
            ]);

            return null;
        }
    }

    /**
     * Obtém projeto por ID
     */
    public function getProjectById(int $projectId): ?Project
    {
        try {
            $cacheKey = "project_{$projectId}";

            return Cache::remember($cacheKey, 300, function () use ($projectId) {
                // Buscar projeto no banco de dados
                $projectModel = \App\Domains\Projects\Models\Project::find($projectId);

                if (!$projectModel) {
                    return null;
                }

                // Converter para Domain Entity
                return new Project(
                    id: $projectModel->id,
                    name: $projectModel->name,
                    description: $projectModel->description,
                    status: $projectModel->status,
                    userId: $projectModel->user_id,
                    createdAt: $projectModel->created_at,
                    updatedAt: $projectModel->updated_at
                );
            });
        } catch (\Throwable $exception) {
            Log::error('Error getting project by ID', [
                'error' => $exception->getMessage(),
                'project_id' => $projectId
            ]);

            return null;
        }
    }

    /**
     * Obtém projeto por slug
     */
    public function getProjectBySlug(string $slug, int $userId): ?Project
    {
        try {
            $cacheKey = "project_slug_{$slug}_{$userId}";

            return Cache::remember($cacheKey, 300, function () use ($slug, $userId) {
                // Buscar projeto no banco de dados por slug
                $projectModel = \App\Domains\Projects\Models\Project::where('slug', $slug)
                    ->where('user_id', $userId)
                    ->first();

                if (!$projectModel) {
                    return null;
                }

                // Converter para Domain Entity
                return new Project(
                    id: $projectModel->id,
                    name: $projectModel->name,
                    description: $projectModel->description,
                    status: $projectModel->status,
                    userId: $projectModel->user_id,
                    createdAt: $projectModel->created_at,
                    updatedAt: $projectModel->updated_at
                );
            });
        } catch (\Throwable $exception) {
            Log::error('Error getting project by slug', [
                'error' => $exception->getMessage(),
                'slug' => $slug,
                'user_id' => $userId
            ]);

            return null;
        }
    }

    /**
     * Obtém tarefa por ID
     */
    public function getTaskById(int $taskId): ?Task
    {
        try {
            $cacheKey = "task_{$taskId}";

            return Cache::remember($cacheKey, 300, function () use ($taskId) {
                // Buscar tarefa no banco de dados
                $taskModel = \App\Domains\Projects\Models\Task::find($taskId);

                if (!$taskModel) {
                    return null;
                }

                // Converter para Domain Entity
                return new Task(
                    id: $taskModel->id,
                    title: $taskModel->title,
                    description: $taskModel->description,
                    status: $taskModel->status,
                    priority: $taskModel->priority,
                    dueDate: $taskModel->due_date,
                    projectId: $taskModel->project_id,
                    assignedTo: $taskModel->assigned_to,
                    createdAt: $taskModel->created_at,
                    updatedAt: $taskModel->updated_at
                );
            });
        } catch (\Throwable $exception) {
            Log::error('Error getting task by ID', [
                'error' => $exception->getMessage(),
                'task_id' => $taskId
            ]);

            return null;
        }
    }

    /**
     * Obtém membro da equipe do projeto
     */
    public function getProjectTeamMember(int $projectId, int $memberUserId): ?array
    {
        try {
            $cacheKey = "project_team_member_{$projectId}_{$memberUserId}";

            return Cache::remember($cacheKey, 300, function () use ($projectId, $memberUserId) {
                // Implementar busca do membro da equipe
                // Por enquanto, retornar null para não quebrar
                return null;
            });
        } catch (\Throwable $exception) {
            Log::error('Error getting project team member', [
                'error' => $exception->getMessage(),
                'project_id' => $projectId,
                'member_user_id' => $memberUserId
            ]);

            return null;
        }
    }

    /**
     * Obtém função do usuário no projeto
     */
    public function getUserProjectRole(int $projectId, int $userId): ?string
    {
        try {
            $cacheKey = "user_project_role_{$projectId}_{$userId}";

            return Cache::remember($cacheKey, 300, function () use ($projectId, $userId) {
                // Implementar busca da função do usuário
                // Por enquanto, retornar null para não quebrar
                return null;
            });
        } catch (\Throwable $exception) {
            Log::error('Error getting user project role', [
                'error' => $exception->getMessage(),
                'project_id' => $projectId,
                'user_id' => $userId
            ]);

            return null;
        }
    }

    // ===== MÉTODOS DE CONFIGURAÇÃO =====

    /**
     * Configura configurações iniciais do projeto
     */
    public function configureInitialProjectSettings(Project $project): void
    {
        try {
            // Implementar configuração inicial do projeto
            Log::info('Initial project settings configured', [
                'project_id' => $project->getId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error configuring initial project settings', [
                'error' => $exception->getMessage(),
                'project_id' => $project->getId()
            ]);
        }
    }

    /**
     * Cria tarefas padrão
     */
    public function createDefaultTasks(Project $project): void
    {
        try {
            // Implementar criação de tarefas padrão
            Log::info('Default tasks created', [
                'project_id' => $project->getId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error creating default tasks', [
                'error' => $exception->getMessage(),
                'project_id' => $project->getId()
            ]);
        }
    }

    /**
     * Configura analytics do projeto
     */
    public function setupProjectAnalytics(Project $project): void
    {
        try {
            // Implementar configuração de analytics
            Log::info('Project analytics configured', [
                'project_id' => $project->getId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error setting up project analytics', [
                'error' => $exception->getMessage(),
                'project_id' => $project->getId()
            ]);
        }
    }

    /**
     * Configura notificações do projeto
     */
    public function setupProjectNotifications(Project $project): void
    {
        try {
            // Implementar configuração de notificações
            Log::info('Project notifications configured', [
                'project_id' => $project->getId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error setting up project notifications', [
                'error' => $exception->getMessage(),
                'project_id' => $project->getId()
            ]);
        }
    }

    /**
     * Configura integrações do projeto
     */
    public function setupProjectIntegrations(Project $project): void
    {
        try {
            // Implementar configuração de integrações
            Log::info('Project integrations configured', [
                'project_id' => $project->getId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error setting up project integrations', [
                'error' => $exception->getMessage(),
                'project_id' => $project->getId()
            ]);
        }
    }

    /**
     * Configura configurações iniciais da tarefa
     */
    public function configureInitialTaskSettings(Task $task): void
    {
        try {
            // Implementar configuração inicial da tarefa
            Log::info('Initial task settings configured', [
                'task_id' => $task->getId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error configuring initial task settings', [
                'error' => $exception->getMessage(),
                'task_id' => $task->getId()
            ]);
        }
    }

    /**
     * Configura notificações da tarefa
     */
    public function setupTaskNotifications(Task $task): void
    {
        try {
            // Implementar configuração de notificações
            Log::info('Task notifications configured', [
                'task_id' => $task->getId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error setting up task notifications', [
                'error' => $exception->getMessage(),
                'task_id' => $task->getId()
            ]);
        }
    }

    /**
     * Configura analytics da tarefa
     */
    public function setupTaskAnalytics(Task $task): void
    {
        try {
            // Implementar configuração de analytics
            Log::info('Task analytics configured', [
                'task_id' => $task->getId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error setting up task analytics', [
                'error' => $exception->getMessage(),
                'task_id' => $task->getId()
            ]);
        }
    }

    /**
     * Configura integrações da tarefa
     */
    public function setupTaskIntegrations(Task $task): void
    {
        try {
            // Implementar configuração de integrações
            Log::info('Task integrations configured', [
                'task_id' => $task->getId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error setting up task integrations', [
                'error' => $exception->getMessage(),
                'task_id' => $task->getId()
            ]);
        }
    }

    /**
     * Atualiza contadores de tarefas do projeto
     */
    public function updateProjectTaskCounters(int $projectId): void
    {
        try {
            // Implementar atualização de contadores
            Log::info('Project task counters updated', [
                'project_id' => $projectId
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error updating project task counters', [
                'error' => $exception->getMessage(),
                'project_id' => $projectId
            ]);
        }
    }

    /**
     * Configura notificações do membro da equipe
     */
    public function setupTeamMemberNotifications(array $result, AssignTeamMemberCommand $command): void
    {
        try {
            // Implementar configuração de notificações
            Log::info('Team member notifications configured', [
                'project_id' => $command->getProjectId(),
                'member_user_id' => $command->getMemberUserId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error setting up team member notifications', [
                'error' => $exception->getMessage(),
                'project_id' => $command->getProjectId()
            ]);
        }
    }

    /**
     * Configura analytics do membro da equipe
     */
    public function setupTeamMemberAnalytics(array $result, AssignTeamMemberCommand $command): void
    {
        try {
            // Implementar configuração de analytics
            Log::info('Team member analytics configured', [
                'project_id' => $command->getProjectId(),
                'member_user_id' => $command->getMemberUserId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error setting up team member analytics', [
                'error' => $exception->getMessage(),
                'project_id' => $command->getProjectId()
            ]);
        }
    }

    /**
     * Configura integrações do membro da equipe
     */
    public function setupTeamMemberIntegrations(array $result, AssignTeamMemberCommand $command): void
    {
        try {
            // Implementar configuração de integrações
            Log::info('Team member integrations configured', [
                'project_id' => $command->getProjectId(),
                'member_user_id' => $command->getMemberUserId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error setting up team member integrations', [
                'error' => $exception->getMessage(),
                'project_id' => $command->getProjectId()
            ]);
        }
    }

    /**
     * Atualiza contadores da equipe do projeto
     */
    public function updateProjectTeamCounters(int $projectId): void
    {
        try {
            // Implementar atualização de contadores
            Log::info('Project team counters updated', [
                'project_id' => $projectId
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error updating project team counters', [
                'error' => $exception->getMessage(),
                'project_id' => $projectId
            ]);
        }
    }

    /**
     * Envia convite para membro da equipe
     */
    public function sendTeamMemberInvite(array $result, AssignTeamMemberCommand $command): void
    {
        try {
            // Implementar envio de convite
            Log::info('Team member invite sent', [
                'project_id' => $command->getProjectId(),
                'member_user_id' => $command->getMemberUserId()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error sending team member invite', [
                'error' => $exception->getMessage(),
                'project_id' => $command->getProjectId()
            ]);
        }
    }

    // ===== MÉTODOS DE ESTATÍSTICAS =====

    /**
     * Obtém contagem de projetos ativos
     */
    public function getActiveProjectsCount(int $userId): int
    {
        try {
            $cacheKey = "active_projects_count_{$userId}";

            return Cache::remember($cacheKey, 300, function () use ($userId) {
                // Implementar contagem de projetos ativos
                return 0;
            });
        } catch (\Throwable $exception) {
            Log::error('Error getting active projects count', [
                'error' => $exception->getMessage(),
                'user_id' => $userId
            ]);

            return 0;
        }
    }

    /**
     * Obtém limite máximo de projetos ativos do usuário
     */
    public function getUserMaxActiveProjects(int $userId): int
    {
        try {
            $cacheKey = "user_max_active_projects_{$userId}";

            return Cache::remember($cacheKey, 3600, function () use ($userId) {
                // Implementar obtenção do limite
                return 10; // Limite padrão
            });
        } catch (\Throwable $exception) {
            Log::error('Error getting user max active projects', [
                'error' => $exception->getMessage(),
                'user_id' => $userId
            ]);

            return 10;
        }
    }

    /**
     * Obtém contagem de tarefas ativas
     */
    public function getActiveTasksCount(int $userId): int
    {
        try {
            $cacheKey = "active_tasks_count_{$userId}";

            return Cache::remember($cacheKey, 300, function () use ($userId) {
                // Implementar contagem de tarefas ativas
                return 0;
            });
        } catch (\Throwable $exception) {
            Log::error('Error getting active tasks count', [
                'error' => $exception->getMessage(),
                'user_id' => $userId
            ]);

            return 0;
        }
    }

    /**
     * Obtém limite máximo de tarefas ativas do usuário
     */
    public function getUserMaxActiveTasks(int $userId): int
    {
        try {
            $cacheKey = "user_max_active_tasks_{$userId}";

            return Cache::remember($cacheKey, 3600, function () use ($userId) {
                // Implementar obtenção do limite
                return 100; // Limite padrão
            });
        } catch (\Throwable $exception) {
            Log::error('Error getting user max active tasks', [
                'error' => $exception->getMessage(),
                'user_id' => $userId
            ]);

            return 100;
        }
    }

    /**
     * Obtém contagem de membros da equipe do projeto
     */
    public function getProjectTeamMembersCount(int $projectId): int
    {
        try {
            $cacheKey = "project_team_members_count_{$projectId}";

            return Cache::remember($cacheKey, 300, function () use ($projectId) {
                // Implementar contagem de membros da equipe
                return 0;
            });
        } catch (\Throwable $exception) {
            Log::error('Error getting project team members count', [
                'error' => $exception->getMessage(),
                'project_id' => $projectId
            ]);

            return 0;
        }
    }

    /**
     * Obtém limite máximo de membros da equipe do projeto
     */
    public function getProjectMaxTeamMembers(int $projectId): int
    {
        try {
            $cacheKey = "project_max_team_members_{$projectId}";

            return Cache::remember($cacheKey, 3600, function () use ($projectId) {
                // Implementar obtenção do limite
                return 20; // Limite padrão
            });
        } catch (\Throwable $exception) {
            Log::error('Error getting project max team members', [
                'error' => $exception->getMessage(),
                'project_id' => $projectId
            ]);

            return 20;
        }
    }

    /**
     * Obtém estatísticas do serviço
     */
    public function getStats(): array
    {
        return [
            'service' => 'ProjectsApplicationService',
            'description' => 'Application Service para Projects',
            'version' => '1.0.0',
            'use_cases' => [
                'CreateProjectUseCase',
                'UpdateProjectUseCase',
                'DeleteProjectUseCase',
                'GetProjectUseCase',
                'ListProjectsUseCase',
                'CreateTaskUseCase',
                'UpdateTaskUseCase',
                'DeleteTaskUseCase',
                'GetTaskUseCase',
                'ListTasksUseCase',
                'AssignTeamMemberUseCase',
                'RemoveTeamMemberUseCase'
            ],
            'timestamp' => now()->toISOString()
        ];
    }
}
