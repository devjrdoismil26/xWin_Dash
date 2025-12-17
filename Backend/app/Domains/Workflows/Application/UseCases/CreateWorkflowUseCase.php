<?php

namespace App\Domains\Workflows\Application\UseCases;

use App\Domains\Workflows\Domain\Workflow;
use App\Domains\Workflows\Application\Commands\CreateWorkflowCommand;
use App\Domains\Workflows\Application\Handlers\CreateWorkflowHandler;
use App\Domains\Workflows\Application\Services\WorkflowsApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\WorkflowCreatedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para criação de workflows
 *
 * Orquestra a criação de um novo workflow,
 * incluindo validações, persistência e eventos.
 */
class CreateWorkflowUseCase
{
    private CreateWorkflowHandler $handler;
    private WorkflowsApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        CreateWorkflowHandler $handler,
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
     * Executa o use case de criação de workflow
     */
    public function execute(CreateWorkflowCommand $command): array
    {
        try {
            Log::info('Starting workflow creation use case', [
                'user_id' => $command->getUserId(),
                'workflow_name' => $command->getName(),
                'workflow_type' => $command->getType()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados do workflow inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Criar entidade de domínio
                $workflow = $this->createWorkflowEntity($command);

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validateWorkflowCreation($workflow, $this->applicationService->getUserById($command->getUserId()));
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Persistir workflow
                $savedWorkflow = $this->handler->handle($command);

                // Executar ações pós-criação
                $this->executePostCreationActions($savedWorkflow, $command);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($savedWorkflow, $command);

                Log::info('Workflow created successfully', [
                    'workflow_id' => $savedWorkflow->getId(),
                    'user_id' => $command->getUserId(),
                    'workflow_name' => $savedWorkflow->getName()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'workflow' => $savedWorkflow->toArray(),
                        'workflow_id' => $savedWorkflow->getId()
                    ],
                    'message' => 'Workflow criado com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in CreateWorkflowUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'workflow_name' => $command->getName()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação do workflow'],
                'message' => 'Falha ao criar workflow'
            ];
        }
    }

    /**
     * Valida o comando de criação
     */
    private function validateCommand(CreateWorkflowCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        if (empty($command->getName())) {
            $errors[] = 'Nome do workflow é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (empty($command->getType())) {
            $errors[] = 'Tipo do workflow é obrigatório';
        }

        // Validar formato do nome
        if (strlen($command->getName()) < 3) {
            $errors[] = 'Nome do workflow deve ter pelo menos 3 caracteres';
        }

        if (strlen($command->getName()) > 100) {
            $errors[] = 'Nome do workflow deve ter no máximo 100 caracteres';
        }

        // Validar tipo de workflow
        $validTypes = ['automation', 'integration', 'notification', 'data_processing', 'approval', 'scheduled', 'trigger'];
        if (!in_array($command->getType(), $validTypes)) {
            $errors[] = 'Tipo de workflow inválido';
        }

        // Validar prioridade
        $validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (!in_array($command->getPriority(), $validPriorities)) {
            $errors[] = 'Prioridade inválida';
        }

        // Validar status
        $validStatuses = ['draft', 'active', 'inactive', 'archived', 'maintenance'];
        if (!in_array($command->getStatus(), $validStatuses)) {
            $errors[] = 'Status inválido';
        }

        // Validar versão
        if ($command->getVersion() && $command->getVersion() < 1) {
            $errors[] = 'Versão deve ser maior que zero';
        }

        // Validar definição do workflow
        if ($command->getDefinition() && !is_array($command->getDefinition())) {
            $errors[] = 'Definição do workflow deve ser um array';
        }

        // Validar triggers
        if ($command->getTriggers() && !is_array($command->getTriggers())) {
            $errors[] = 'Triggers devem ser um array';
        }

        // Validar condições
        if ($command->getConditions() && !is_array($command->getConditions())) {
            $errors[] = 'Condições devem ser um array';
        }

        // Validar ações
        if ($command->getActions() && !is_array($command->getActions())) {
            $errors[] = 'Ações devem ser um array';
        }

        return $errors;
    }

    /**
     * Cria entidade de domínio
     */
    private function createWorkflowEntity(CreateWorkflowCommand $command): Workflow
    {
        return new Workflow(
            name: $command->getName(),
            userId: $command->getUserId(),
            description: $command->getDescription(),
            status: $command->getStatus(),
            type: $command->getType(),
            priority: $command->getPriority(),
            version: $command->getVersion() ?? 1,
            tags: $command->getTags(),
            metadata: $command->getMetadata(),
            definition: $command->getDefinition(),
            triggers: $command->getTriggers(),
            conditions: $command->getConditions(),
            actions: $command->getActions(),
            variables: $command->getVariables(),
            settings: $command->getSettings(),
            customFields: $command->getCustomFields()
        );
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(Workflow $workflow, int $userId): array
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

            // Validar definição do workflow
            $definitionErrors = $this->validateWorkflowDefinition($workflow);
            if (!empty($definitionErrors)) {
                return $definitionErrors;
            }

            // Validar triggers
            $triggerErrors = $this->validateTriggers($workflow->getTriggers());
            if (!empty($triggerErrors)) {
                return $triggerErrors;
            }

            // Validar ações
            $actionErrors = $this->validateActions($workflow->getActions());
            if (!empty($actionErrors)) {
                return $actionErrors;
            }

            // Validação bem-sucedida
            return [
                'valid' => true,
                'message' => 'Cross-module validation passed',
                'user_id' => $userId,
                'validated_at' => now()->toISOString()
            ];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for workflow', [
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

        // Verificar limite de workflows ativos
        $activeWorkflowsCount = $this->applicationService->getActiveWorkflowsCount($userId);
        $maxActiveWorkflows = $this->applicationService->getUserMaxActiveWorkflows($userId);

        if ($activeWorkflowsCount >= $maxActiveWorkflows) {
            $errors[] = "Usuário excedeu o limite de workflows ativos ({$maxActiveWorkflows})";
        }

        return $errors;
    }

    /**
     * Valida definição do workflow
     */
    private function validateWorkflowDefinition(Workflow $workflow): array
    {
        $errors = [];

        if (!$workflow->getDefinition()) {
            return $errors;
        }

        $definition = $workflow->getDefinition();

        // Validar estrutura básica
        if (!isset($definition['nodes']) || !is_array($definition['nodes'])) {
            $errors[] = 'Definição deve conter nós válidos';
        }

        if (!isset($definition['edges']) || !is_array($definition['edges'])) {
            $errors[] = 'Definição deve conter arestas válidas';
        }

        // Validar nós
        if (isset($definition['nodes'])) {
            foreach ($definition['nodes'] as $node) {
                if (!isset($node['id']) || !isset($node['type'])) {
                    $errors[] = 'Cada nó deve ter ID e tipo';
                }
            }
        }

        // Validar arestas
        if (isset($definition['edges'])) {
            foreach ($definition['edges'] as $edge) {
                if (!isset($edge['source']) || !isset($edge['target'])) {
                    $errors[] = 'Cada aresta deve ter origem e destino';
                }
            }
        }

        return $errors;
    }

    /**
     * Valida triggers
     */
    private function validateTriggers(?array $triggers): array
    {
        $errors = [];

        if (!$triggers) {
            return $errors;
        }

        foreach ($triggers as $trigger) {
            if (!isset($trigger['type']) || !isset($trigger['config'])) {
                $errors[] = 'Cada trigger deve ter tipo e configuração';
            }

            // Validar tipos de trigger
            $validTriggerTypes = ['webhook', 'schedule', 'event', 'manual', 'api'];
            if (isset($trigger['type']) && !in_array($trigger['type'], $validTriggerTypes)) {
                $errors[] = "Tipo de trigger inválido: {$trigger['type']}";
            }
        }

        return $errors;
    }

    /**
     * Valida ações
     */
    private function validateActions(?array $actions): array
    {
        $errors = [];

        if (!$actions) {
            return $errors;
        }

        foreach ($actions as $action) {
            if (!isset($action['type']) || !isset($action['config'])) {
                $errors[] = 'Cada ação deve ter tipo e configuração';
            }

            // Validar tipos de ação
            $validActionTypes = ['email', 'webhook', 'database', 'api', 'notification', 'file', 'script'];
            if (isset($action['type']) && !in_array($action['type'], $validActionTypes)) {
                $errors[] = "Tipo de ação inválido: {$action['type']}";
            }
        }

        return $errors;
    }

    /**
     * Executa ações pós-criação
     */
    private function executePostCreationActions(Workflow $workflow, CreateWorkflowCommand $command): void
    {
        try {
            // Configurar workflow inicial
            $this->applicationService->configureInitialWorkflowSettings($workflow);

            // Configurar analytics
            $this->applicationService->setupWorkflowAnalytics($workflow);

            // Configurar notificações
            $this->applicationService->setupWorkflowNotifications($workflow);

            // Configurar integrações
            $this->applicationService->setupWorkflowIntegrations($workflow);

            // Configurar webhooks
            $this->applicationService->setupWorkflowWebhooks($workflow);

            // Configurar versionamento
            $this->applicationService->setupWorkflowVersioning($workflow);

            // Configurar monitoramento
            $this->applicationService->setupWorkflowMonitoring($workflow);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-creation actions for workflow', [
                'error' => $exception->getMessage(),
                'workflow_id' => $workflow->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(Workflow $workflow, CreateWorkflowCommand $command): void
    {
        try {
            $event = new WorkflowCreatedEvent(
                workflowId: $workflow->getId(),
                workflowName: $workflow->getName(),
                userId: $command->getUserId(),
                projectId: $command->getProjectId(),
                workflowType: $workflow->getType(),
                metadata: [
                    'priority' => $workflow->getPriority(),
                    'status' => $workflow->getStatus(),
                    'version' => $workflow->getVersion(),
                    'triggers_count' => count($workflow->getTriggers() ?? []),
                    'actions_count' => count($workflow->getActions() ?? []),
                    'source' => 'use_case',
                    'created_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching workflow created event', [
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
            'use_case' => 'CreateWorkflowUseCase',
            'description' => 'Criação de workflows',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
