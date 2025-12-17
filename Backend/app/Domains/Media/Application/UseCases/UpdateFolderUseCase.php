<?php

namespace App\Domains\Media\Application\UseCases;

use App\Domains\Media\Application\Commands\UpdateFolderCommand;
use App\Domains\Media\Application\Handlers\UpdateFolderHandler;
use App\Domains\Media\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Media\Domain\Events\FolderUpdatedEvent;
use Illuminate\Support\Facades\Log;

class UpdateFolderUseCase
{
    public function __construct(
        private UpdateFolderHandler $updateHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(UpdateFolderCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para atualização da pasta'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateFolderUpdate($command);
            if (!$crossModuleValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $crossModuleValidation['errors'],
                    'message' => 'Regras de negócio não atendidas'
                ];
            }

            // Executar atualização
            $this->updateHandler->handle($command);

            // Disparar evento de atualização
            $this->eventDispatcher->dispatch(
                new FolderUpdatedEvent(
                    $command->folderId,
                    $command->userId,
                    $command->toArray()
                )
            );

            Log::info('Folder updated successfully via Use Case', [
                'folder_id' => $command->folderId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'message' => 'Pasta atualizada com sucesso',
                'data' => [
                    'folder_id' => $command->folderId,
                    'updated_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in UpdateFolderUseCase', [
                'error' => $exception->getMessage(),
                'folder_id' => $command->folderId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atualização da pasta'],
                'message' => 'Falha ao atualizar pasta'
            ];
        }
    }
}
