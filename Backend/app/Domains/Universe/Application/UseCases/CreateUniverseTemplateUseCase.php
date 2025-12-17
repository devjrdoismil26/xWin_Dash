<?php

namespace App\Domains\Universe\Application\UseCases;

use App\Domains\Universe\Domain\UniverseTemplate;
use App\Domains\Universe\Application\Commands\CreateUniverseTemplateCommand;
use App\Domains\Universe\Application\Handlers\CreateUniverseTemplateHandler;
use App\Domains\Universe\Application\Services\UniverseApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\UniverseTemplateCreatedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para criação de templates do universo
 *
 * Orquestra a criação de um novo template do universo,
 * incluindo validações, persistência e eventos.
 */
class CreateUniverseTemplateUseCase
{
    private CreateUniverseTemplateHandler $handler;
    private UniverseApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        CreateUniverseTemplateHandler $handler,
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
     * Executa o use case de criação de template do universo
     */
    public function execute(CreateUniverseTemplateCommand $command): array
    {
        try {
            Log::info('Starting universe template creation use case', [
                'user_id' => $command->getUserId(),
                'template_name' => $command->getName(),
                'template_category' => $command->getCategory()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados do template inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Criar entidade de domínio
                $template = $this->createUniverseTemplateEntity($command);

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validateUniverseTemplateCreation($template, $this->applicationService->getUserById($command->getUserId()));
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Persistir template
                $savedTemplate = $this->handler->handle($command);

                // Executar ações pós-criação
                $this->executePostCreationActions($savedTemplate, $command);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($savedTemplate, $command);

                Log::info('Universe template created successfully', [
                    'template_id' => $savedTemplate->getId(),
                    'user_id' => $command->getUserId(),
                    'template_name' => $savedTemplate->getName()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'universe_template' => $savedTemplate->toArray(),
                        'template_id' => $savedTemplate->getId()
                    ],
                    'message' => 'Template do universo criado com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in CreateUniverseTemplateUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'template_name' => $command->getName()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação do template'],
                'message' => 'Falha ao criar template do universo'
            ];
        }
    }

    /**
     * Valida o comando de criação
     */
    private function validateCommand(CreateUniverseTemplateCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        if (empty($command->getName())) {
            $errors[] = 'Nome do template é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        // Validar formato do nome
        if (strlen($command->getName()) < 3) {
            $errors[] = 'Nome do template deve ter pelo menos 3 caracteres';
        }

        if (strlen($command->getName()) > 100) {
            $errors[] = 'Nome do template deve ter no máximo 100 caracteres';
        }

        // Validar categoria
        $validCategories = ['business', 'education', 'entertainment', 'health', 'technology', 'lifestyle', 'other'];
        if ($command->getCategory() && !in_array($command->getCategory(), $validCategories)) {
            $errors[] = 'Categoria inválida';
        }

        // Validar dificuldade
        $validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
        if ($command->getDifficulty() && !in_array($command->getDifficulty(), $validDifficulties)) {
            $errors[] = 'Dificuldade inválida';
        }

        // Validar slug se fornecido
        if ($command->getSlug() && !preg_match('/^[a-z0-9-]+$/', $command->getSlug())) {
            $errors[] = 'Slug deve conter apenas letras minúsculas, números e hífens';
        }

        // Validar template pai se fornecido
        if ($command->getParentTemplateId() && $command->getParentTemplateId() <= 0) {
            $errors[] = 'ID do template pai deve ser maior que zero';
        }

        // Validar configuração
        if ($command->getConfiguration() && !is_array($command->getConfiguration())) {
            $errors[] = 'Configuração deve ser um array';
        }

        // Validar tags
        if ($command->getTags() && !is_array($command->getTags())) {
            $errors[] = 'Tags devem ser um array';
        }

        return $errors;
    }

    /**
     * Cria entidade de domínio
     */
    private function createUniverseTemplateEntity(CreateUniverseTemplateCommand $command): UniverseTemplate
    {
        return new UniverseTemplate(
            name: $command->getName(),
            userId: $command->getUserId(),
            description: $command->getDescription(),
            category: $command->getCategory(),
            difficulty: $command->getDifficulty(),
            slug: $command->getSlug(),
            tags: $command->getTags(),
            metadata: $command->getMetadata(),
            parentTemplateId: $command->getParentTemplateId(),
            configuration: $command->getConfiguration(),
            isPublic: $command->getIsPublic(),
            isFeatured: $command->getIsFeatured(),
            usageCount: $command->getUsageCount(),
            rating: $command->getRating(),
            ratingCount: $command->getRatingCount(),
            customFields: $command->getCustomFields()
        );
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(UniverseTemplate $template, int $userId): array
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
            $slugErrors = $this->validateUniqueSlug($template->getSlug(), $userId);
            if (!empty($slugErrors)) {
                return $slugErrors;
            }

            // Validar template pai se fornecido
            if ($template->getParentTemplateId()) {
                $parentErrors = $this->validateParentTemplate($template->getParentTemplateId(), $userId);
                if (!empty($parentErrors)) {
                    return $parentErrors;
                }
            }

            return [];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for universe template', [
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

        // Verificar limite de templates
        $currentTemplatesCount = $this->applicationService->getUserTemplatesCount($userId);
        $maxTemplates = $this->applicationService->getUserMaxTemplates($userId);

        if ($currentTemplatesCount >= $maxTemplates) {
            $errors[] = "Usuário excedeu o limite de templates ({$maxTemplates})";
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
            $existingTemplate = $this->applicationService->getUniverseTemplateBySlug($slug, $userId);
            if ($existingTemplate) {
                return ['Slug já está em uso por outro template'];
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
     * Valida template pai
     */
    private function validateParentTemplate(?int $parentTemplateId, int $userId): array
    {
        if (!$parentTemplateId) {
            return [];
        }

        try {
            $parentTemplate = $this->applicationService->getUniverseTemplateById($parentTemplateId);

            if (!$parentTemplate) {
                return ['Template pai não encontrado'];
            }

            if (!$parentTemplate->isPublic() && $parentTemplate->getUserId() !== $userId) {
                return ['Template pai não é público e não pertence ao usuário'];
            }

            if (!$parentTemplate->isActive()) {
                return ['Template pai não está ativo'];
            }

            // Verificar se não criaria loop (template dentro de si mesmo)
            if ($this->wouldCreateLoop($parentTemplateId, $userId)) {
                return ['Não é possível criar template dentro de si mesmo'];
            }

            return [];
        } catch (\Exception $e) {
            Log::error('Error validating parent template', [
                'parent_template_id' => $parentTemplateId,
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            return ['Erro ao validar template pai'];
        }
    }

    /**
     * Verifica se criaria loop na hierarquia
     */
    private function wouldCreateLoop(int $parentTemplateId, int $userId): bool
    {
        // Implementar verificação de loop na hierarquia
        // Por enquanto, retornar false
        return false;
    }

    /**
     * Executa ações pós-criação
     */
    private function executePostCreationActions(UniverseTemplate $template, CreateUniverseTemplateCommand $command): void
    {
        try {
            // Configurar template inicial
            $this->applicationService->configureInitialTemplateSettings($template);

            // Configurar analytics
            $this->applicationService->setupTemplateAnalytics($template);

            // Configurar notificações
            $this->applicationService->setupTemplateNotifications($template);

            // Configurar integrações
            $this->applicationService->setupTemplateIntegrations($template);

            // Configurar webhooks
            $this->applicationService->setupTemplateWebhooks($template);

            // Aplicar template pai se fornecido
            if ($template->getParentTemplateId()) {
                $this->applicationService->applyParentTemplateToTemplate($template);
            }

            // Configurar versionamento
            $this->applicationService->setupTemplateVersioning($template);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-creation actions for universe template', [
                'error' => $exception->getMessage(),
                'template_id' => $template->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(UniverseTemplate $template, CreateUniverseTemplateCommand $command): void
    {
        try {
            $event = new UniverseTemplateCreatedEvent(
                templateId: $template->getId(),
                templateName: $template->getName(),
                userId: $command->getUserId(),
                projectId: $command->getProjectId(),
                templateCategory: $template->getCategory(),
                metadata: [
                    'difficulty' => $template->getDifficulty(),
                    'is_public' => $template->getIsPublic(),
                    'is_featured' => $template->getIsFeatured(),
                    'parent_template_id' => $template->getParentTemplateId(),
                    'source' => 'use_case',
                    'created_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching universe template created event', [
                'error' => $exception->getMessage(),
                'template_id' => $template->getId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'CreateUniverseTemplateUseCase',
            'description' => 'Criação de templates do universo',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
