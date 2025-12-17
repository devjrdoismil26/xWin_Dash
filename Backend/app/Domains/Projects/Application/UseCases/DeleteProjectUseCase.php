<?php

namespace App\Domains\Projects\Application\UseCases;

use App\Domains\Projects\Application\Commands\DeleteProjectCommand;
use App\Domains\Projects\Application\Handlers\DeleteProjectHandler;
use App\Domains\Projects\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Projects\Domain\Events\ProjectDeletedEvent;
use Illuminate\Support\Facades\Log;

class DeleteProjectUseCase
{
    public function __construct(
        private DeleteProjectHandler $deleteHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(DeleteProjectCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para remoção do projeto'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateProjectDeletion($command);
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
                new ProjectDeletedEvent(
                    $command->projectId,
                    $command->userId,
                    $command->reason,
                    $command->forceDelete
                )
            );

            Log::info('Project deleted successfully via Use Case', [
                'project_id' => $command->projectId,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete
            ]);

            return [
                'success' => true,
                'message' => 'Projeto removido com sucesso',
                'data' => [
                    'project_id' => $command->projectId,
                    'deleted_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in DeleteProjectUseCase', [
                'error' => $exception->getMessage(),
                'project_id' => $command->projectId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante remoção do projeto'],
                'message' => 'Falha ao remover projeto'
            ];
        }
    }
}
