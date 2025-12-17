<?php

namespace App\Domains\Media\Application\UseCases;

use App\Domains\Media\Application\Commands\DeleteMediaCommand;
use App\Domains\Media\Application\Handlers\DeleteMediaHandler;
use App\Domains\Media\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Media\Domain\Events\MediaDeletedEvent;
use Illuminate\Support\Facades\Log;

class DeleteMediaUseCase
{
    public function __construct(
        private DeleteMediaHandler $deleteHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(DeleteMediaCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para remoção da mídia'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateMediaDeletion($command);
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
                new MediaDeletedEvent(
                    $command->mediaId,
                    $command->userId,
                    $command->reason,
                    $command->forceDelete
                )
            );

            Log::info('Media deleted successfully via Use Case', [
                'media_id' => $command->mediaId,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete
            ]);

            return [
                'success' => true,
                'message' => 'Mídia removida com sucesso',
                'data' => [
                    'media_id' => $command->mediaId,
                    'deleted_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in DeleteMediaUseCase', [
                'error' => $exception->getMessage(),
                'media_id' => $command->mediaId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante remoção da mídia'],
                'message' => 'Falha ao remover mídia'
            ];
        }
    }
}
