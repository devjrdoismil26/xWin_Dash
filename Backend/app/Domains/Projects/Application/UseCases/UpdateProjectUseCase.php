<?php

namespace App\Domains\Projects\Application\UseCases;

use App\Domains\Projects\Application\Commands\UpdateProjectCommand;
use App\Domains\Projects\Application\Handlers\UpdateProjectHandler;
use App\Domains\Projects\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Projects\Domain\Events\ProjectUpdatedEvent;
use Illuminate\Support\Facades\Log;

class UpdateProjectUseCase
{
    public function __construct(
        private UpdateProjectHandler $updateHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(UpdateProjectCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para atualização do projeto'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateProjectUpdate($command);
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
                new ProjectUpdatedEvent(
                    $command->projectId,
                    $command->userId,
                    $command->toArray()
                )
            );

            Log::info('Project updated successfully via Use Case', [
                'project_id' => $command->projectId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'message' => 'Projeto atualizado com sucesso',
                'data' => [
                    'project_id' => $command->projectId,
                    'updated_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in UpdateProjectUseCase', [
                'error' => $exception->getMessage(),
                'project_id' => $command->projectId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atualização do projeto'],
                'message' => 'Falha ao atualizar projeto'
            ];
        }
    }
}
