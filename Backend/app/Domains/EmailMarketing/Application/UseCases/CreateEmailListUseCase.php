<?php

namespace App\Domains\EmailMarketing\Application\UseCases;

use App\Domains\EmailMarketing\Domain\EmailList;
use App\Domains\EmailMarketing\Application\Commands\CreateEmailListCommand;
use App\Domains\EmailMarketing\Application\Handlers\CreateEmailListHandler;
use App\Domains\EmailMarketing\Application\Services\EmailMarketingApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\EmailListCreatedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para criação de listas de email
 *
 * Orquestra a criação de uma nova lista de email,
 * incluindo validações, persistência e eventos.
 */
class CreateEmailListUseCase
{
    private CreateEmailListHandler $handler;
    private EmailMarketingApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        CreateEmailListHandler $handler,
        EmailMarketingApplicationService $applicationService,
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Executa o use case de criação de lista de email
     */
    public function execute(CreateEmailListCommand $command): array
    {
        try {
            Log::info('Starting email list creation use case', [
                'user_id' => $command->getUserId(),
                'list_name' => $command->getName(),
                'list_type' => $command->getType()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados da lista inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Criar entidade de domínio
                $emailList = $this->createEmailListEntity($command);

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validateCrossModuleRules($emailList, $command->getUserId());
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Persistir lista
                $savedEmailList = $this->handler->handle($command);

                // Executar ações pós-criação
                $this->executePostCreationActions($savedEmailList, $command);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($savedEmailList, $command);

                Log::info('Email list created successfully', [
                    'list_id' => $savedEmailList->getId(),
                    'user_id' => $command->getUserId(),
                    'list_name' => $savedEmailList->getName()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'email_list' => $savedEmailList->toArray(),
                        'list_id' => $savedEmailList->getId()
                    ],
                    'message' => 'Lista de email criada com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in CreateEmailListUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'list_name' => $command->getName()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação da lista'],
                'message' => 'Falha ao criar lista de email'
            ];
        }
    }

    /**
     * Valida o comando de criação
     */
    private function validateCommand(CreateEmailListCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        if (empty($command->getName())) {
            $errors[] = 'Nome da lista é obrigatório';
        }

        if (empty($command->getType())) {
            $errors[] = 'Tipo da lista é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        // Validar formato do nome
        if (strlen($command->getName()) < 3) {
            $errors[] = 'Nome da lista deve ter pelo menos 3 caracteres';
        }

        if (strlen($command->getName()) > 100) {
            $errors[] = 'Nome da lista deve ter no máximo 100 caracteres';
        }

        // Validar tipo de lista
        $validTypes = ['static', 'dynamic', 'segment'];
        if (!in_array($command->getType(), $validTypes)) {
            $errors[] = 'Tipo de lista inválido';
        }

        // Validar slug se fornecido
        if ($command->getSlug() && !preg_match('/^[a-z0-9-]+$/', $command->getSlug())) {
            $errors[] = 'Slug deve conter apenas letras minúsculas, números e hífens';
        }

        return $errors;
    }

    /**
     * Cria entidade de domínio
     */
    private function createEmailListEntity(CreateEmailListCommand $command): EmailList
    {
        return new EmailList(
            name: $command->getName(),
            userId: $command->getUserId(),
            description: $command->getDescription(),
            status: $command->getStatus() ?? 'active',
            type: $command->getType(),
            slug: $command->getSlug(),
            tags: $command->getTags(),
            customFields: $command->getCustomFields(),
            segmentationRules: $command->getSegmentationRules(),
            metadata: $command->getMetadata()
        );
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(EmailList $emailList, int $userId): array
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
            $slugErrors = $this->validateUniqueSlug($emailList->getSlug(), $userId);
            if (!empty($slugErrors)) {
                return $slugErrors;
            }

            return [];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for email list', [
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

        // Verificar limite de listas ativas
        $activeListsCount = $this->applicationService->getActiveEmailListsCount($userId);
        $maxActiveLists = $this->applicationService->getUserMaxActiveEmailLists($userId);

        if ($activeListsCount >= $maxActiveLists) {
            $errors[] = "Usuário excedeu o limite de listas ativas ({$maxActiveLists})";
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

        $existingList = $this->applicationService->getEmailListBySlug($slug, $userId);
        if ($existingList) {
            return ['Slug já está em uso por outra lista'];
        }

        return [];
    }

    /**
     * Executa ações pós-criação
     */
    private function executePostCreationActions(EmailList $emailList, CreateEmailListCommand $command): void
    {
        try {
            // Configurar lista inicial
            $this->applicationService->configureInitialListSettings($emailList);

            // Configurar campos personalizados padrão
            if (empty($command->getCustomFields())) {
                $this->applicationService->setupDefaultCustomFields($emailList);
            }

            // Configurar regras de segmentação padrão
            if (empty($command->getSegmentationRules())) {
                $this->applicationService->setupDefaultSegmentationRules($emailList);
            }

            // Configurar analytics
            $this->applicationService->setupListAnalytics($emailList);

            // Configurar webhooks
            $this->applicationService->setupListWebhooks($emailList);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-creation actions for email list', [
                'error' => $exception->getMessage(),
                'list_id' => $emailList->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(EmailList $emailList, CreateEmailListCommand $command): void
    {
        try {
            $event = new EmailListCreatedEvent(
                listId: $emailList->getId(),
                listName: $emailList->getName(),
                userId: $command->getUserId(),
                projectId: $command->getProjectId(),
                listType: $emailList->getType(),
                metadata: [
                    'slug' => $emailList->getSlug(),
                    'status' => $emailList->getStatus(),
                    'source' => 'use_case',
                    'created_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching email list created event', [
                'error' => $exception->getMessage(),
                'list_id' => $emailList->getId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'CreateEmailListUseCase',
            'description' => 'Criação de listas de email',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
