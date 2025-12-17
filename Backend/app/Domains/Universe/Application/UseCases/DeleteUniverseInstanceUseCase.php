<?php

namespace App\Domains\Universe\Application\UseCases;

use App\Domains\Universe\Application\Commands\DeleteUniverseInstanceCommand;
use App\Domains\Universe\Application\Handlers\DeleteUniverseInstanceHandler;
use App\Domains\Universe\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Universe\Domain\Events\UniverseInstanceDeletedEvent;
use Illuminate\Support\Facades\Log;

class DeleteUniverseInstanceUseCase
{
    public function __construct(
        private DeleteUniverseInstanceHandler $deleteHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(DeleteUniverseInstanceCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para remoção da instância'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateUniverseInstanceDeletion($command);
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
                new UniverseInstanceDeletedEvent(
                    $command->instanceId,
                    $command->userId,
                    $command->reason,
                    $command->forceDelete
                )
            );

            Log::info('Universe Instance deleted successfully via Use Case', [
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete
            ]);

            return [
                'success' => true,
                'message' => 'Instância removida com sucesso',
                'data' => [
                    'instance_id' => $command->instanceId,
                    'deleted_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in DeleteUniverseInstanceUseCase', [
                'error' => $exception->getMessage(),
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante remoção da instância'],
                'message' => 'Falha ao remover instância'
            ];
        }
    }
}
