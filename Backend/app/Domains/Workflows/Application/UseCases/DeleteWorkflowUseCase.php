<?php

namespace App\Domains\Workflows\Application\UseCases;

use App\Domains\Workflows\Application\Commands\DeleteWorkflowCommand;
use App\Domains\Workflows\Application\Handlers\DeleteWorkflowHandler;
use App\Domains\Workflows\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Workflows\Domain\Events\WorkflowDeletedEvent;
use Illuminate\Support\Facades\Log;

class DeleteWorkflowUseCase
{
    public function __construct(
        private DeleteWorkflowHandler $deleteHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(DeleteWorkflowCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para remoção do workflow'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateWorkflowDeletion($command);
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
                new WorkflowDeletedEvent(
                    $command->workflowId,
                    $command->userId,
                    $command->reason,
                    $command->forceDelete
                )
            );

            Log::info('Workflow deleted successfully via Use Case', [
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete
            ]);

            return [
                'success' => true,
                'message' => 'Workflow removido com sucesso',
                'data' => [
                    'workflow_id' => $command->workflowId,
                    'deleted_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in DeleteWorkflowUseCase', [
                'error' => $exception->getMessage(),
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante remoção do workflow'],
                'message' => 'Falha ao remover workflow'
            ];
        }
    }
}
