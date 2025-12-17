<?php

namespace App\Domains\Workflows\Application\UseCases;

use App\Domains\Workflows\Application\Commands\UpdateWorkflowCommand;
use App\Domains\Workflows\Application\Handlers\UpdateWorkflowHandler;
use App\Domains\Workflows\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Workflows\Domain\Events\WorkflowUpdatedEvent;
use Illuminate\Support\Facades\Log;

class UpdateWorkflowUseCase
{
    public function __construct(
        private UpdateWorkflowHandler $updateHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(UpdateWorkflowCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para atualização do workflow'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateWorkflowUpdate($command);
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
                new WorkflowUpdatedEvent(
                    $command->workflowId,
                    $command->userId,
                    $command->toArray()
                )
            );

            Log::info('Workflow updated successfully via Use Case', [
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'message' => 'Workflow atualizado com sucesso',
                'data' => [
                    'workflow_id' => $command->workflowId,
                    'updated_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in UpdateWorkflowUseCase', [
                'error' => $exception->getMessage(),
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atualização do workflow'],
                'message' => 'Falha ao atualizar workflow'
            ];
        }
    }
}
