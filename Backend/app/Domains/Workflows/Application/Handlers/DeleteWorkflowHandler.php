<?php

namespace App\Domains\Workflows\Application\Handlers;

use App\Domains\Workflows\Application\Commands\DeleteWorkflowCommand;
use App\Domains\Workflows\Domain\Repositories\WorkflowRepositoryInterface;
use App\Domains\Workflows\Domain\Services\WorkflowServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Workflows\Domain\Events\WorkflowDeletedEvent;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowId;
use App\Domains\Workflows\Domain\Exceptions\WorkflowNotFoundException;
use App\Domains\Workflows\Domain\Exceptions\InvalidWorkflowDeletionException;
use Illuminate\Support\Facades\Log;

class DeleteWorkflowHandler
{
    public function __construct(
        private WorkflowRepositoryInterface $workflowRepository,
        private WorkflowServiceInterface $workflowService,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function handle(DeleteWorkflowCommand $command): void
    {
        try {
            // Buscar o workflow existente
            $workflowId = new WorkflowId($command->workflowId);
            $existingWorkflow = $this->workflowRepository->findById($workflowId);

            if (!$existingWorkflow) {
                throw new WorkflowNotFoundException("Workflow with ID {$command->workflowId} not found");
            }

            // Validar se o workflow pode ser deletado
            if (!$this->workflowService->canDeleteWorkflow($existingWorkflow, $command->forceDelete)) {
                throw new InvalidWorkflowDeletionException("Workflow cannot be deleted in current status");
            }

            // Parar execuções ativas se necessário
            if ($existingWorkflow->isActive() && !$command->forceDelete) {
                $this->workflowService->stopActiveExecutions($workflowId);
            }

            // Deletar do repositório
            $this->workflowRepository->delete($workflowId);

            // Disparar evento de deleção
            $this->eventDispatcher->dispatch(
                new WorkflowDeletedEvent(
                    $workflowId,
                    $command->userId,
                    $command->reason,
                    $command->forceDelete
                )
            );

            Log::info('Workflow deleted successfully', [
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete,
                'reason' => $command->reason
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete workflow', [
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
