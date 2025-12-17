<?php

namespace App\Domains\Workflows\Application\Handlers;

use App\Domains\Workflows\Application\Commands\ExecuteWorkflowCommand;
use App\Domains\Workflows\Domain\Repositories\WorkflowRepositoryInterface;
use App\Domains\Workflows\Domain\Services\WorkflowServiceInterface;
use App\Domains\Workflows\Domain\Services\WorkflowExecutionServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Workflows\Domain\Events\WorkflowExecutionStartedEvent;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowId;
use App\Domains\Workflows\Domain\Exceptions\WorkflowNotFoundException;
use App\Domains\Workflows\Domain\Exceptions\WorkflowExecutionException;
use Illuminate\Support\Facades\Log;

class ExecuteWorkflowHandler
{
    public function __construct(
        private WorkflowRepositoryInterface $workflowRepository,
        private WorkflowServiceInterface $workflowService,
        private WorkflowExecutionServiceInterface $executionService,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function handle(ExecuteWorkflowCommand $command): void
    {
        try {
            // Buscar o workflow
            $workflowId = new WorkflowId($command->workflowId);
            $workflow = $this->workflowRepository->findById($workflowId);

            if (!$workflow) {
                throw new WorkflowNotFoundException("Workflow with ID {$command->workflowId} not found");
            }

            // Validar se o workflow pode ser executado
            if (!$this->workflowService->canExecuteWorkflow($workflow)) {
                throw new WorkflowExecutionException("Workflow cannot be executed in current status");
            }

            // Preparar dados de execução
            $executionData = [
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId,
                'initial_payload' => $command->initialPayload,
                'execution_mode' => $command->executionMode,
                'priority' => $command->priority,
                'context' => $command->context,
                'triggered_by' => $command->triggeredBy
            ];

            // Executar o workflow
            $execution = $this->executionService->startExecution($executionData);

            // Disparar evento de execução iniciada
            $this->eventDispatcher->dispatch(
                new WorkflowExecutionStartedEvent(
                    $execution->getId(),
                    $command->workflowId,
                    $command->userId,
                    $command->executionMode
                )
            );

            Log::info('Workflow execution started successfully', [
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId,
                'execution_id' => $execution->getId(),
                'execution_mode' => $command->executionMode
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to execute workflow', [
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
