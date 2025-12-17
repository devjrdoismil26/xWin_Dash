<?php

namespace App\Domains\Universe\Application\UseCases;

use App\Domains\Universe\Application\Commands\UpdateUniverseInstanceCommand;
use App\Domains\Universe\Application\Handlers\UpdateUniverseInstanceHandler;
use App\Domains\Universe\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Universe\Domain\Events\UniverseInstanceUpdatedEvent;
use Illuminate\Support\Facades\Log;

class UpdateUniverseInstanceUseCase
{
    public function __construct(
        private UpdateUniverseInstanceHandler $updateHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(UpdateUniverseInstanceCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para atualização da instância'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateUniverseInstanceUpdate($command);
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
                new UniverseInstanceUpdatedEvent(
                    $command->instanceId,
                    $command->userId,
                    $command->toArray()
                )
            );

            Log::info('Universe Instance updated successfully via Use Case', [
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'message' => 'Instância atualizada com sucesso',
                'data' => [
                    'instance_id' => $command->instanceId,
                    'updated_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in UpdateUniverseInstanceUseCase', [
                'error' => $exception->getMessage(),
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atualização da instância'],
                'message' => 'Falha ao atualizar instância'
            ];
        }
    }
}
