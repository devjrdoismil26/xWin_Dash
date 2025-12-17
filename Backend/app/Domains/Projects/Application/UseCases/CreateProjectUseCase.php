<?php

namespace App\Domains\Projects\Application\UseCases;

use App\Domains\Projects\Domain\Project;
use App\Domains\Projects\Application\Commands\CreateProjectCommand;
use App\Domains\Projects\Application\Handlers\CreateProjectHandler;
use App\Domains\Projects\Application\Services\ProjectsApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\ProjectCreatedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para criação de projetos
 *
 * Orquestra a criação de um novo projeto,
 * incluindo validações, persistência e eventos.
 */
class CreateProjectUseCase
{
    private CreateProjectHandler $handler;
    private ProjectsApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        CreateProjectHandler $handler,
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
     * Executa o use case de criação de projeto
     */
    public function execute(CreateProjectCommand $command): array
    {
        try {
            Log::info('Starting project creation use case', [
                'user_id' => $command->getUserId(),
                'project_name' => $command->getName(),
                'project_type' => $command->getType()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados do projeto inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Criar entidade de domínio
                $project = $this->createProjectEntity($command);

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validateProjectCreation($project, $this->applicationService->getUserById($command->getUserId()));
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Persistir projeto
                $savedProject = $this->handler->handle($command);

                // Executar ações pós-criação
                $this->executePostCreationActions($savedProject, $command);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($savedProject, $command);

                Log::info('Project created successfully', [
                    'project_id' => $savedProject->getId(),
                    'user_id' => $command->getUserId(),
                    'project_name' => $savedProject->getName()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'project' => $savedProject->toArray(),
                        'project_id' => $savedProject->getId()
                    ],
                    'message' => 'Projeto criado com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in CreateProjectUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'project_name' => $command->getName()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação do projeto'],
                'message' => 'Falha ao criar projeto'
            ];
        }
    }

    /**
     * Valida o comando de criação
     */
    private function validateCommand(CreateProjectCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        if (empty($command->getName())) {
            $errors[] = 'Nome do projeto é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        // Validar formato do nome
        if (strlen($command->getName()) < 3) {
            $errors[] = 'Nome do projeto deve ter pelo menos 3 caracteres';
        }

        if (strlen($command->getName()) > 100) {
            $errors[] = 'Nome do projeto deve ter no máximo 100 caracteres';
        }

        // Validar tipo de projeto
        $validTypes = ['web_development', 'mobile_app', 'marketing', 'design', 'research', 'other'];
        if (!in_array($command->getType(), $validTypes)) {
            $errors[] = 'Tipo de projeto inválido';
        }

        // Validar prioridade
        $validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (!in_array($command->getPriority(), $validPriorities)) {
            $errors[] = 'Prioridade inválida';
        }

        // Validar datas
        if ($command->getStartDate() && $command->getEndDate() && $command->getStartDate() > $command->getEndDate()) {
            $errors[] = 'Data de início não pode ser posterior à data de fim';
        }

        if ($command->getDeadline() && $command->getStartDate() && $command->getDeadline() < $command->getStartDate()) {
            $errors[] = 'Prazo não pode ser anterior à data de início';
        }

        // Validar orçamento
        if ($command->getBudget() !== null && $command->getBudget() < 0) {
            $errors[] = 'Orçamento não pode ser negativo';
        }

        return $errors;
    }

    /**
     * Cria entidade de domínio
     */
    private function createProjectEntity(CreateProjectCommand $command): Project
    {
        return new Project(
            name: $command->getName(),
            userId: $command->getUserId(),
            description: $command->getDescription(),
            status: $command->getStatus() ?? 'planning',
            priority: $command->getPriority(),
            type: $command->getType(),
            slug: $command->getSlug(),
            tags: $command->getTags(),
            metadata: $command->getMetadata(),
            startDate: $command->getStartDate(),
            endDate: $command->getEndDate(),
            deadline: $command->getDeadline(),
            budget: $command->getBudget(),
            budgetCurrency: $command->getBudgetCurrency(),
            teamMembers: $command->getTeamMembers(),
            stakeholders: $command->getStakeholders(),
            clientName: $command->getClientName(),
            clientEmail: $command->getClientEmail(),
            clientPhone: $command->getClientPhone(),
            attachments: $command->getAttachments(),
            customFields: $command->getCustomFields()
        );
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(Project $project, int $userId): array
    {
        try {
            // Buscar usuário para validação
            $user = $this->applicationService->getUserById($userId);
            if (!$user) {
                return ['Usuário não encontrado'];
            }

            // Validar limites do usuário
            $limitErrors = $this->validateUserLimits($userId);
            if (!empty($limitErrors)) {
                return $limitErrors;
            }

            // Validar slug único
            $slugErrors = $this->validateUniqueSlug($project->getSlug(), $userId);
            if (!empty($slugErrors)) {
                return $slugErrors;
            }

            // Validar membros da equipe
            $teamErrors = $this->validateTeamMembers($project->getTeamMembers(), $userId);
            if (!empty($teamErrors)) {
                return $teamErrors;
            }

            // Validação bem-sucedida
            return [
                'valid' => true,
                'message' => 'Cross-module validation passed',
                'user_id' => $userId,
                'project_name' => $project->getName(),
                'validated_at' => now()->toISOString()
            ];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for project', [
                'error' => $exception->getMessage(),
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

        // Verificar limite de projetos ativos
        $activeProjectsCount = $this->applicationService->getActiveProjectsCount($userId);
        $maxActiveProjects = $this->applicationService->getUserMaxActiveProjects($userId);

        if ($activeProjectsCount >= $maxActiveProjects) {
            $errors[] = "Usuário excedeu o limite de projetos ativos ({$maxActiveProjects})";
        }

        return $errors;
    }

    /**
     * Valida slug único
     */
    private function validateUniqueSlug(?string $slug, int $userId): array
    {
        if (!$slug) {
            return [
                'valid' => true,
                'message' => 'No slug specified'
            ];
        }

        $existingProject = $this->applicationService->getProjectBySlug($slug, $userId);
        if ($existingProject) {
            return ['Slug já está em uso por outro projeto'];
        }

        // Validação bem-sucedida
        return [
            'valid' => true,
            'message' => 'Slug is unique',
            'slug' => $slug,
            'user_id' => $userId
        ];
    }

    /**
     * Valida membros da equipe
     */
    private function validateTeamMembers(array $teamMembers, int $userId): array
    {
        $errors = [];

        foreach ($teamMembers as $member) {
            if (!isset($member['user_id']) || $member['user_id'] <= 0) {
                $errors[] = 'ID do membro da equipe é obrigatório';
                continue;
            }

            if (!isset($member['role']) || empty($member['role'])) {
                $errors[] = 'Função do membro da equipe é obrigatória';
                continue;
            }

            // Verificar se o usuário existe
            $memberUser = $this->applicationService->getUserById($member['user_id']);
            if (!$memberUser) {
                $errors[] = "Usuário ID {$member['user_id']} não encontrado";
            }
        }

        return $errors;
    }

    /**
     * Executa ações pós-criação
     */
    private function executePostCreationActions(Project $project, CreateProjectCommand $command): void
    {
        try {
            // Configurar projeto inicial
            $this->applicationService->configureInitialProjectSettings($project);

            // Criar tarefas padrão se não fornecidas
            if (empty($command->getDefaultTasks())) {
                $this->applicationService->createDefaultTasks($project);
            }

            // Configurar analytics
            $this->applicationService->setupProjectAnalytics($project);

            // Configurar notificações
            $this->applicationService->setupProjectNotifications($project);

            // Configurar integrações
            $this->applicationService->setupProjectIntegrations($project);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-creation actions for project', [
                'error' => $exception->getMessage(),
                'project_id' => $project->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(Project $project, CreateProjectCommand $command): void
    {
        try {
            $event = new ProjectCreatedEvent(
                projectId: $project->getId(),
                projectName: $project->getName(),
                userId: $command->getUserId(),
                projectType: $project->getType(),
                metadata: [
                    'priority' => $project->getPriority(),
                    'status' => $project->getStatus(),
                    'budget' => $project->getBudget(),
                    'team_members_count' => count($project->getTeamMembers()),
                    'source' => 'use_case',
                    'created_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching project created event', [
                'error' => $exception->getMessage(),
                'project_id' => $project->getId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'CreateProjectUseCase',
            'description' => 'Criação de projetos',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
