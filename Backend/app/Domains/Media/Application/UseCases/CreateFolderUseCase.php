<?php

namespace App\Domains\Media\Application\UseCases;

use App\Domains\Media\Domain\Folder;
use App\Domains\Media\Application\Commands\CreateFolderCommand;
use App\Domains\Media\Application\Handlers\CreateFolderHandler;
use App\Domains\Media\Application\Services\MediaApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\FolderCreatedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para criação de pastas
 *
 * Orquestra a criação de uma nova pasta,
 * incluindo validações, persistência e eventos.
 */
class CreateFolderUseCase
{
    private CreateFolderHandler $handler;
    private MediaApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        CreateFolderHandler $handler,
        MediaApplicationService $applicationService,
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Executa o use case de criação de pasta
     */
    public function execute(CreateFolderCommand $command): array
    {
        try {
            Log::info('Starting folder creation use case', [
                'user_id' => $command->getUserId(),
                'folder_name' => $command->getName(),
                'parent_folder_id' => $command->getParentFolderId()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados da pasta inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Criar entidade de domínio
                $folder = $this->createFolderEntity($command);

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validateCrossModuleRules($folder, $command->getUserId());
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Persistir pasta
                $savedFolder = $this->handler->handle($command);

                // Executar ações pós-criação
                $this->executePostCreationActions($savedFolder, $command);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($savedFolder, $command);

                Log::info('Folder created successfully', [
                    'folder_id' => $savedFolder->getId(),
                    'user_id' => $command->getUserId(),
                    'folder_name' => $savedFolder->getName()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'folder' => $savedFolder->toArray(),
                        'folder_id' => $savedFolder->getId()
                    ],
                    'message' => 'Pasta criada com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in CreateFolderUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'folder_name' => $command->getName()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação da pasta'],
                'message' => 'Falha ao criar pasta'
            ];
        }
    }

    /**
     * Valida o comando de criação
     */
    private function validateCommand(CreateFolderCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        if (empty($command->getName())) {
            $errors[] = 'Nome da pasta é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        // Validar formato do nome
        if (strlen($command->getName()) < 1) {
            $errors[] = 'Nome da pasta deve ter pelo menos 1 caractere';
        }

        if (strlen($command->getName()) > 100) {
            $errors[] = 'Nome da pasta deve ter no máximo 100 caracteres';
        }

        // Validar caracteres no nome
        if (!preg_match('/^[a-zA-Z0-9\s._-]+$/', $command->getName())) {
            $errors[] = 'Nome da pasta contém caracteres inválidos';
        }

        // Validar tipo de pasta
        $validTypes = ['folder', 'collection', 'gallery'];
        if (!in_array($command->getType(), $validTypes)) {
            $errors[] = 'Tipo de pasta inválido';
        }

        // Validar pasta pai se fornecida
        if ($command->getParentFolderId() && $command->getParentFolderId() <= 0) {
            $errors[] = 'ID da pasta pai deve ser maior que zero';
        }

        return $errors;
    }

    /**
     * Cria entidade de domínio
     */
    private function createFolderEntity(CreateFolderCommand $command): Folder
    {
        return new Folder(
            name: $command->getName(),
            userId: $command->getUserId(),
            parentFolderId: $command->getParentFolderId(),
            description: $command->getDescription(),
            status: $command->getStatus() ?? 'active',
            type: $command->getType(),
            slug: $command->getSlug(),
            tags: $command->getTags(),
            metadata: $command->getMetadata()
        );
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(Folder $folder, int $userId): array
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

            // Validar pasta pai se fornecida
            if ($folder->getParentFolderId()) {
                $parentErrors = $this->validateParentFolder($folder->getParentFolderId(), $userId);
                if (!empty($parentErrors)) {
                    return $parentErrors;
                }
            }

            // Validar slug único
            $slugErrors = $this->validateUniqueSlug($folder->getSlug(), $userId, $folder->getParentFolderId());
            if (!empty($slugErrors)) {
                return $slugErrors;
            }

            return [];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for folder', [
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

        // Verificar limite de pastas
        $currentFoldersCount = $this->applicationService->getUserFoldersCount($userId);
        $maxFolders = $this->applicationService->getUserMaxFolders($userId);

        if ($currentFoldersCount >= $maxFolders) {
            $errors[] = "Usuário excedeu o limite de pastas ({$maxFolders})";
        }

        return $errors;
    }

    /**
     * Valida pasta pai
     */
    private function validateParentFolder(?int $parentFolderId, int $userId): array
    {
        if (!$parentFolderId) {
            return [];
        }

        $parentFolder = $this->applicationService->getFolderById($parentFolderId);

        if (!$parentFolder) {
            return ['Pasta pai não encontrada'];
        }

        if ($parentFolder->getUserId() !== $userId) {
            return ['Pasta pai não pertence ao usuário'];
        }

        if (!$parentFolder->isActive()) {
            return ['Pasta pai não está ativa'];
        }

        // Verificar se não criaria loop (pasta dentro de si mesma)
        if ($this->wouldCreateLoop($parentFolderId, $userId)) {
            return ['Não é possível criar pasta dentro de si mesma'];
        }

        return [];
    }

    /**
     * Verifica se criaria loop na hierarquia
     */
    private function wouldCreateLoop(int $parentFolderId, int $userId): bool
    {
        // Implementar verificação de loop na hierarquia
        // Por enquanto, retornar false
        return false;
    }

    /**
     * Valida slug único
     */
    private function validateUniqueSlug(?string $slug, int $userId, ?int $parentFolderId): array
    {
        if (!$slug) {
            return [];
        }

        $existingFolder = $this->applicationService->getFolderBySlug($slug, $userId, $parentFolderId);
        if ($existingFolder) {
            return ['Slug já está em uso por outra pasta'];
        }

        return [];
    }

    /**
     * Executa ações pós-criação
     */
    private function executePostCreationActions(Folder $folder, CreateFolderCommand $command): void
    {
        try {
            // Configurar pasta inicial
            $this->applicationService->configureInitialFolderSettings($folder);

            // Configurar permissões padrão
            $this->applicationService->setupDefaultFolderPermissions($folder);

            // Configurar analytics
            $this->applicationService->setupFolderAnalytics($folder);

            // Configurar webhooks
            $this->applicationService->setupFolderWebhooks($folder);

            // Atualizar contadores da pasta pai
            if ($folder->getParentFolderId()) {
                $this->applicationService->updateParentFolderCounters($folder->getParentFolderId());
            }
        } catch (\Throwable $exception) {
            Log::error('Error executing post-creation actions for folder', [
                'error' => $exception->getMessage(),
                'folder_id' => $folder->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(Folder $folder, CreateFolderCommand $command): void
    {
        try {
            $event = new FolderCreatedEvent(
                folderId: $folder->getId(),
                folderName: $folder->getName(),
                userId: $command->getUserId(),
                projectId: $command->getProjectId(),
                folderType: $folder->getType(),
                metadata: [
                    'parent_folder_id' => $folder->getParentFolderId(),
                    'slug' => $folder->getSlug(),
                    'status' => $folder->getStatus(),
                    'source' => 'use_case',
                    'created_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching folder created event', [
                'error' => $exception->getMessage(),
                'folder_id' => $folder->getId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'CreateFolderUseCase',
            'description' => 'Criação de pastas',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
