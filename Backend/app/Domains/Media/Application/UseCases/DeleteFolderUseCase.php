<?php

namespace App\Domains\Media\Application\UseCases;

use App\Domains\Media\Application\Commands\DeleteFolderCommand;
use App\Domains\Media\Application\Handlers\DeleteFolderHandler;
use App\Domains\Media\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Media\Domain\Events\FolderDeletedEvent;
use Illuminate\Support\Facades\Log;

class DeleteFolderUseCase
{
    public function __construct(
        private DeleteFolderHandler $deleteHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(DeleteFolderCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para remoção da pasta'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateFolderDeletion($command);
            if (!$crossModuleValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $crossModuleValidation['errors'],
                    'message' => 'Regras de negócio não atendidas'
                ];
            }

            // Executar remoção
            $this->deleteHandler->handle($command);

            // Disparar evento de remoção
            $this->eventDispatcher->dispatch(
                new FolderDeletedEvent(
                    $command->folderId,
                    $command->userId,
                    $command->reason,
                    $command->forceDelete
                )
            );

            Log::info('Folder deleted successfully via Use Case', [
                'folder_id' => $command->folderId,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete
            ]);

            return [
                'success' => true,
                'message' => 'Pasta removida com sucesso',
                'data' => [
                    'folder_id' => $command->folderId,
                    'deleted_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in DeleteFolderUseCase', [
                'error' => $exception->getMessage(),
                'folder_id' => $command->folderId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante remoção da pasta'],
                'message' => 'Falha ao remover pasta'
            ];
        }
    }
}
