<?php

namespace App\Domains\Universe\Application\UseCases;

use App\Domains\Universe\Application\Commands\ShareUniverseInstanceCommand;
use App\Domains\Universe\Application\Handlers\ShareUniverseInstanceHandler;
use App\Domains\Universe\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Universe\Domain\Events\UniverseInstanceSharedEvent;
use Illuminate\Support\Facades\Log;

class ShareUniverseInstanceUseCase
{
    public function __construct(
        private ShareUniverseInstanceHandler $shareHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(ShareUniverseInstanceCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para compartilhamento da instância'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateUniverseInstanceSharing($command);
            if (!$crossModuleValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $crossModuleValidation['errors'],
                    'message' => 'Regras de negócio não atendidas'
                ];
            }

            // Executar compartilhamento
            $this->shareHandler->handle($command);

            // Disparar evento de compartilhamento
            $this->eventDispatcher->dispatch(
                new UniverseInstanceSharedEvent(
                    $command->instanceId,
                    $command->userId,
                    $command->shareWith,
                    $command->permission
                )
            );

            Log::info('Universe Instance shared successfully via Use Case', [
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId,
                'shared_with_count' => count($command->shareWith),
                'permission' => $command->permission
            ]);

            return [
                'success' => true,
                'message' => 'Instância compartilhada com sucesso',
                'data' => [
                    'instance_id' => $command->instanceId,
                    'shared_with' => $command->shareWith,
                    'permission' => $command->permission,
                    'shared_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in ShareUniverseInstanceUseCase', [
                'error' => $exception->getMessage(),
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante compartilhamento da instância'],
                'message' => 'Falha ao compartilhar instância'
            ];
        }
    }
}
