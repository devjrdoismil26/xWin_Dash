<?php

namespace App\Domains\Universe\Application\UseCases;

use App\Domains\Universe\Domain\UniverseInstance;
use App\Domains\Universe\Application\Commands\CreateUniverseInstanceCommand;
use App\Domains\Universe\Application\Handlers\CreateUniverseInstanceHandler;
use App\Domains\Universe\Application\Services\UniverseApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\UniverseInstanceCreatedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para criação de instâncias do universo
 *
 * Orquestra a criação de uma nova instância do universo,
 * incluindo validações, persistência e eventos.
 */
class CreateUniverseInstanceUseCase
{
    private CreateUniverseInstanceHandler $handler;
    private UniverseApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        CreateUniverseInstanceHandler $handler,
        UniverseApplicationService $applicationService,
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Executa o use case de criação de instância do universo
     */
    public function execute(CreateUniverseInstanceCommand $command): array
    {
        try {
            Log::info('Starting universe instance creation use case', [
                'user_id' => $command->getUserId(),
                'instance_name' => $command->getName(),
                'instance_type' => $command->getType()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados da instância inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Criar entidade de domínio
                $instance = $this->createUniverseInstanceEntity($command);

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validateUniverseInstanceCreation($instance, $this->applicationService->getUserById($command->getUserId()));
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Persistir instância
                $savedInstance = $this->handler->handle($command);

                // Executar ações pós-criação
                $this->executePostCreationActions($savedInstance, $command);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($savedInstance, $command);

                Log::info('Universe instance created successfully', [
                    'instance_id' => $savedInstance->getId(),
                    'user_id' => $command->getUserId(),
                    'instance_name' => $savedInstance->getName()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'universe_instance' => $savedInstance->toArray(),
                        'instance_id' => $savedInstance->getId()
                    ],
                    'message' => 'Instância do universo criada com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in CreateUniverseInstanceUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'instance_name' => $command->getName()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação da instância'],
                'message' => 'Falha ao criar instância do universo'
            ];
        }
    }

    /**
     * Valida o comando de criação
     */
    private function validateCommand(CreateUniverseInstanceCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        if (empty($command->getName())) {
            $errors[] = 'Nome da instância é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        // Validar formato do nome
        if (strlen($command->getName()) < 3) {
            $errors[] = 'Nome da instância deve ter pelo menos 3 caracteres';
        }

        if (strlen($command->getName()) > 100) {
            $errors[] = 'Nome da instância deve ter no máximo 100 caracteres';
        }

        // Validar tipo de instância
        $validTypes = ['personal', 'shared', 'public', 'template'];
        if (!in_array($command->getType(), $validTypes)) {
            $errors[] = 'Tipo de instância inválido';
        }

        // Validar status
        $validStatuses = ['draft', 'active', 'inactive', 'archived'];
        if (!in_array($command->getStatus(), $validStatuses)) {
            $errors[] = 'Status inválido';
        }

        // Validar slug se fornecido
        if ($command->getSlug() && !preg_match('/^[a-z0-9-]+$/', $command->getSlug())) {
            $errors[] = 'Slug deve conter apenas letras minúsculas, números e hífens';
        }

        // Validar template se fornecido
        if ($command->getTemplateId() && $command->getTemplateId() <= 0) {
            $errors[] = 'ID do template deve ser maior que zero';
        }

        // Validar instância pai se fornecida
        if ($command->getParentInstanceId() && $command->getParentInstanceId() <= 0) {
            $errors[] = 'ID da instância pai deve ser maior que zero';
        }

        return $errors;
    }

    /**
     * Cria entidade de domínio
     */
    private function createUniverseInstanceEntity(CreateUniverseInstanceCommand $command): UniverseInstance
    {
        return new UniverseInstance(
            name: $command->getName(),
            userId: $command->getUserId(),
            description: $command->getDescription(),
            status: $command->getStatus(),
            type: $command->getType(),
            slug: $command->getSlug(),
            tags: $command->getTags(),
            metadata: $command->getMetadata(),
            templateId: $command->getTemplateId(),
            parentInstanceId: $command->getParentInstanceId(),
            configuration: $command->getConfiguration(),
            permissions: $command->getPermissions(),
            isPublic: $command->getIsPublic(),
            isShared: $command->getIsShared(),
            shareToken: $command->getShareToken(),
            customFields: $command->getCustomFields()
        );
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(UniverseInstance $instance, int $userId): array
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
            $slugErrors = $this->validateUniqueSlug($instance->getSlug(), $userId);
            if (!empty($slugErrors)) {
                return $slugErrors;
            }

            // Validar template se fornecido
            if ($instance->getTemplateId()) {
                $templateErrors = $this->validateTemplate($instance->getTemplateId(), $userId);
                if (!empty($templateErrors)) {
                    return $templateErrors;
                }
            }

            // Validar instância pai se fornecida
            if ($instance->getParentInstanceId()) {
                $parentErrors = $this->validateParentInstance($instance->getParentInstanceId(), $userId);
                if (!empty($parentErrors)) {
                    return $parentErrors;
                }
            }

            return [];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for universe instance', [
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

        // Verificar limite de instâncias ativas
        $activeInstancesCount = $this->applicationService->getActiveInstancesCount($userId);
        $maxActiveInstances = $this->applicationService->getUserMaxActiveInstances($userId);

        if ($activeInstancesCount >= $maxActiveInstances) {
            $errors[] = "Usuário excedeu o limite de instâncias ativas ({$maxActiveInstances})";
        }

        return $errors;
    }

    /**
     * Valida slug único
     */
    private function validateUniqueSlug(?string $slug, int $userId): array
    {
        if (!$slug) {
            return [];
        }

        try {
            $existingInstance = $this->applicationService->getUniverseInstanceBySlug($slug, $userId);
            if ($existingInstance) {
                return ['Slug já está em uso por outra instância'];
            }

            return [];
        } catch (\Exception $e) {
            Log::error('Error validating unique slug', [
                'slug' => $slug,
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            return ['Erro ao validar slug único'];
        }
    }

    /**
     * Valida template
     */
    private function validateTemplate(?int $templateId, int $userId): array
    {
        if (!$templateId) {
            return [];
        }

        try {
            $template = $this->applicationService->getUniverseTemplateById($templateId);

            if (!$template) {
                return ['Template não encontrado'];
            }

            if (!$template->isPublic() && $template->getUserId() !== $userId) {
                return ['Template não é público e não pertence ao usuário'];
            }

            if (!$template->isActive()) {
                return ['Template não está ativo'];
            }

            return [];
        } catch (\Exception $e) {
            Log::error('Error validating template', [
                'template_id' => $templateId,
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            return ['Erro ao validar template'];
        }
    }

    /**
     * Valida instância pai
     */
    private function validateParentInstance(?int $parentInstanceId, int $userId): array
    {
        if (!$parentInstanceId) {
            return [];
        }

        try {
            $parentInstance = $this->applicationService->getUniverseInstanceById($parentInstanceId);

            if (!$parentInstance) {
                return ['Instância pai não encontrada'];
            }

            if ($parentInstance->getUserId() !== $userId) {
                return ['Instância pai não pertence ao usuário'];
            }

            if (!$parentInstance->isActive()) {
                return ['Instância pai não está ativa'];
            }

            // Verificar se não criaria loop (instância dentro de si mesma)
            if ($this->wouldCreateLoop($parentInstanceId, $userId)) {
                return ['Não é possível criar instância dentro de si mesma'];
            }

            return [];
        } catch (\Exception $e) {
            Log::error('Error validating parent instance', [
                'parent_instance_id' => $parentInstanceId,
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            return ['Erro ao validar instância pai'];
        }
    }

    /**
     * Verifica se criaria loop na hierarquia
     */
    private function wouldCreateLoop(int $parentInstanceId, int $userId): bool
    {
        // Implementar verificação de loop na hierarquia
        // Por enquanto, retornar false
        return false;
    }

    /**
     * Executa ações pós-criação
     */
    private function executePostCreationActions(UniverseInstance $instance, CreateUniverseInstanceCommand $command): void
    {
        try {
            // Configurar instância inicial
            $this->applicationService->configureInitialInstanceSettings($instance);

            // Configurar permissões padrão
            $this->applicationService->setupDefaultInstancePermissions($instance);

            // Configurar analytics
            $this->applicationService->setupInstanceAnalytics($instance);

            // Configurar notificações
            $this->applicationService->setupInstanceNotifications($instance);

            // Configurar integrações
            $this->applicationService->setupInstanceIntegrations($instance);

            // Configurar webhooks
            $this->applicationService->setupInstanceWebhooks($instance);

            // Aplicar template se fornecido
            if ($instance->getTemplateId()) {
                $this->applicationService->applyTemplateToInstance($instance);
            }
        } catch (\Throwable $exception) {
            Log::error('Error executing post-creation actions for universe instance', [
                'error' => $exception->getMessage(),
                'instance_id' => $instance->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(UniverseInstance $instance, CreateUniverseInstanceCommand $command): void
    {
        try {
            $event = new UniverseInstanceCreatedEvent(
                instanceId: $instance->getId(),
                instanceName: $instance->getName(),
                userId: $command->getUserId(),
                projectId: $command->getProjectId(),
                instanceType: $instance->getType(),
                metadata: [
                    'status' => $instance->getStatus(),
                    'template_id' => $instance->getTemplateId(),
                    'parent_instance_id' => $instance->getParentInstanceId(),
                    'is_public' => $instance->getIsPublic(),
                    'is_shared' => $instance->getIsShared(),
                    'source' => 'use_case',
                    'created_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching universe instance created event', [
                'error' => $exception->getMessage(),
                'instance_id' => $instance->getId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'CreateUniverseInstanceUseCase',
            'description' => 'Criação de instâncias do universo',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
