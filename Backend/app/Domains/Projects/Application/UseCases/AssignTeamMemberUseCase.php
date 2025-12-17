<?php

namespace App\Domains\Projects\Application\UseCases;

use App\Domains\Projects\Domain\Project;
use App\Domains\Projects\Application\Commands\AssignTeamMemberCommand;
use App\Domains\Projects\Application\Handlers\AssignTeamMemberHandler;
use App\Domains\Projects\Application\Services\ProjectsApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\TeamMemberAssignedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para atribuição de membros da equipe
 *
 * Orquestra a atribuição de um membro da equipe a um projeto,
 * incluindo validações, processamento e eventos.
 */
class AssignTeamMemberUseCase
{
    private AssignTeamMemberHandler $handler;
    private ProjectsApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        AssignTeamMemberHandler $handler,
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
     * Executa o use case de atribuição de membro da equipe
     */
    public function execute(AssignTeamMemberCommand $command): array
    {
        try {
            Log::info('Starting team member assignment use case', [
                'project_id' => $command->getProjectId(),
                'user_id' => $command->getUserId(),
                'member_user_id' => $command->getMemberUserId(),
                'role' => $command->getRole()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados da atribuição inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validateTeamMemberAssignment($command);
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Processar atribuição
                $result = $this->handler->handle($command);

                // Executar ações pós-atribuição
                $this->executePostAssignmentActions($result, $command);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($result, $command);

                Log::info('Team member assigned successfully', [
                    'project_id' => $command->getProjectId(),
                    'user_id' => $command->getUserId(),
                    'member_user_id' => $command->getMemberUserId(),
                    'role' => $command->getRole()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'project_id' => $command->getProjectId(),
                        'member_user_id' => $command->getMemberUserId(),
                        'role' => $command->getRole(),
                        'assigned_at' => now()->toISOString()
                    ],
                    'message' => 'Membro da equipe atribuído com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in AssignTeamMemberUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'project_id' => $command->getProjectId(),
                'user_id' => $command->getUserId(),
                'member_user_id' => $command->getMemberUserId()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atribuição do membro da equipe'],
                'message' => 'Falha ao atribuir membro da equipe'
            ];
        }
    }

    /**
     * Valida o comando de atribuição
     */
    private function validateCommand(AssignTeamMemberCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        if ($command->getProjectId() <= 0) {
            $errors[] = 'ID do projeto é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if ($command->getMemberUserId() <= 0) {
            $errors[] = 'ID do membro da equipe é obrigatório';
        }

        if (empty($command->getRole())) {
            $errors[] = 'Função é obrigatória';
        }

        // Validar função
        $validRoles = ['owner', 'admin', 'member', 'viewer', 'contributor'];
        if (!in_array($command->getRole(), $validRoles)) {
            $errors[] = 'Função inválida';
        }

        // Validar permissões
        $validPermissions = ['read', 'write', 'admin', 'owner'];
        if (!empty($command->getPermissions())) {
            foreach ($command->getPermissions() as $permission) {
                if (!in_array($permission, $validPermissions)) {
                    $errors[] = "Permissão '{$permission}' inválida";
                }
            }
        }

        // Validar datas
        if ($command->getStartDate() && $command->getEndDate() && $command->getStartDate() > $command->getEndDate()) {
            $errors[] = 'Data de início não pode ser posterior à data de fim';
        }

        return $errors;
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(AssignTeamMemberCommand $command): array
    {
        try {
            // Buscar usuário para validação
            $user = $this->applicationService->getUserById($command->getUserId());
            if (!$user) {
                return ['Usuário não encontrado'];
            }

            // Buscar membro da equipe
            $memberUser = $this->applicationService->getUserById($command->getMemberUserId());
            if (!$memberUser) {
                return ['Membro da equipe não encontrado'];
            }

            // Validar projeto
            $projectErrors = $this->validateProject($command->getProjectId(), $command->getUserId());
            if (!empty($projectErrors)) {
                return $projectErrors;
            }

            // Validar se o membro já está na equipe
            $existingMemberErrors = $this->validateExistingMember($command->getProjectId(), $command->getMemberUserId());
            if (!empty($existingMemberErrors)) {
                return $existingMemberErrors;
            }

            // Validar limites do projeto
            $limitErrors = $this->validateProjectLimits($command->getProjectId());
            if (!empty($limitErrors)) {
                return $limitErrors;
            }

            // Validar permissões do usuário
            $permissionErrors = $this->validateUserPermissions($command->getProjectId(), $command->getUserId(), $command->getRole());
            if (!empty($permissionErrors)) {
                return $permissionErrors;
            }

            return [];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for team member assignment', [
                'error' => $exception->getMessage(),
                'project_id' => $command->getProjectId(),
                'user_id' => $command->getUserId()
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

        return [];
    }

    /**
     * Valida se o membro já está na equipe
     */
    private function validateExistingMember(int $projectId, int $memberUserId): array
    {
        $existingMember = $this->applicationService->getProjectTeamMember($projectId, $memberUserId);

        if ($existingMember) {
            return ['Membro já está na equipe do projeto'];
        }

        return [];
    }

    /**
     * Valida limites do projeto
     */
    private function validateProjectLimits(int $projectId): array
    {
        $errors = [];

        // Verificar limite de membros da equipe
        $currentMembersCount = $this->applicationService->getProjectTeamMembersCount($projectId);
        $maxMembers = $this->applicationService->getProjectMaxTeamMembers($projectId);

        if ($currentMembersCount >= $maxMembers) {
            $errors[] = "Projeto excedeu o limite de membros da equipe ({$maxMembers})";
        }

        return $errors;
    }

    /**
     * Valida permissões do usuário
     */
    private function validateUserPermissions(int $projectId, int $userId, string $role): array
    {
        $errors = [];

        // Verificar se o usuário tem permissão para atribuir membros
        $userRole = $this->applicationService->getUserProjectRole($projectId, $userId);

        if (!$userRole) {
            return ['Usuário não tem acesso ao projeto'];
        }

        // Verificar se o usuário pode atribuir a função específica
        $allowedRoles = $this->getAllowedRolesForUser($userRole);
        if (!in_array($role, $allowedRoles)) {
            $errors[] = "Usuário não tem permissão para atribuir função '{$role}'";
        }

        return $errors;
    }

    /**
     * Obtém funções permitidas para o usuário
     */
    private function getAllowedRolesForUser(string $userRole): array
    {
        $rolePermissions = [
            'owner' => ['owner', 'admin', 'member', 'viewer', 'contributor'],
            'admin' => ['admin', 'member', 'viewer', 'contributor'],
            'member' => ['member', 'viewer', 'contributor'],
            'viewer' => [],
            'contributor' => ['viewer']
        ];

        return $rolePermissions[$userRole] ?? [];
    }

    /**
     * Executa ações pós-atribuição
     */
    private function executePostAssignmentActions(array $result, AssignTeamMemberCommand $command): void
    {
        try {
            // Configurar notificações
            $this->applicationService->setupTeamMemberNotifications($result, $command);

            // Configurar analytics
            $this->applicationService->setupTeamMemberAnalytics($result, $command);

            // Configurar integrações
            $this->applicationService->setupTeamMemberIntegrations($result, $command);

            // Atualizar contadores do projeto
            $this->applicationService->updateProjectTeamCounters($command->getProjectId());

            // Enviar convite se necessário
            $this->applicationService->sendTeamMemberInvite($result, $command);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-assignment actions', [
                'error' => $exception->getMessage(),
                'project_id' => $command->getProjectId(),
                'member_user_id' => $command->getMemberUserId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(array $result, AssignTeamMemberCommand $command): void
    {
        try {
            $event = new TeamMemberAssignedEvent(
                projectId: $command->getProjectId(),
                userId: $command->getUserId(),
                memberUserId: $command->getMemberUserId(),
                metadata: [
                    'role' => $command->getRole(),
                    'permissions' => $command->getPermissions(),
                    'start_date' => $command->getStartDate()?->format('Y-m-d H:i:s'),
                    'end_date' => $command->getEndDate()?->format('Y-m-d H:i:s'),
                    'source' => 'use_case',
                    'assigned_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching team member assigned event', [
                'error' => $exception->getMessage(),
                'project_id' => $command->getProjectId(),
                'member_user_id' => $command->getMemberUserId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'AssignTeamMemberUseCase',
            'description' => 'Atribuição de membros da equipe',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
