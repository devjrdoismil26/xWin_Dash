<?php

namespace App\Domains\Workflows\Application\Handlers;

use App\Domains\Workflows\Application\Commands\UpdateWorkflowCommand;
use App\Domains\Workflows\Domain\Repositories\WorkflowRepositoryInterface;
use App\Domains\Workflows\Domain\Services\WorkflowServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Workflows\Domain\Events\WorkflowUpdatedEvent;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowId;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowStatus;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowType;
use App\Domains\Workflows\Domain\Exceptions\WorkflowNotFoundException;
use App\Domains\Workflows\Domain\Exceptions\InvalidWorkflowUpdateException;
use Illuminate\Support\Facades\Log;

class UpdateWorkflowHandler
{
    public function __construct(
        private WorkflowRepositoryInterface $workflowRepository,
        private WorkflowServiceInterface $workflowService,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function handle(UpdateWorkflowCommand $command): void
    {
        try {
            // Buscar o workflow existente
            $workflowId = new WorkflowId($command->workflowId);
            $existingWorkflow = $this->workflowRepository->findById($workflowId);

            if (!$existingWorkflow) {
                throw new WorkflowNotFoundException("Workflow with ID {$command->workflowId} not found");
            }

            // Validar se o workflow pode ser atualizado
            if (!$this->workflowService->canUpdateWorkflow($existingWorkflow)) {
                throw new InvalidWorkflowUpdateException("Workflow cannot be updated in current status");
            }

            // Preparar dados para atualização
            $updateData = $this->prepareUpdateData($command, $existingWorkflow);

            // Atualizar no repositório
            $updatedWorkflow = $this->workflowRepository->update($workflowId, $updateData);

            // Disparar evento de atualização
            $this->eventDispatcher->dispatch(
                new WorkflowUpdatedEvent(
                    $updatedWorkflow->getId(),
                    $command->userId,
                    $updateData
                )
            );

            Log::info('Workflow updated successfully', [
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId,
                'updated_fields' => array_keys($updateData)
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update workflow', [
                'workflow_id' => $command->workflowId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function prepareUpdateData(UpdateWorkflowCommand $command, $existingWorkflow): array
    {
        $updateData = [];

        if ($command->name !== null) {
            $updateData['name'] = $command->name;
        }

        if ($command->description !== null) {
            $updateData['description'] = $command->description;
        }

        if ($command->type !== null) {
            $updateData['type'] = new WorkflowType($command->type);
        }

        if ($command->configuration !== null) {
            $updateData['configuration'] = $command->configuration;
        }

        if ($command->nodes !== null) {
            $updateData['nodes'] = $command->nodes;
        }

        if ($command->connections !== null) {
            $updateData['connections'] = $command->connections;
        }

        if ($command->status !== null) {
            $updateData['status'] = new WorkflowStatus($command->status);
        }

        if ($command->isActive !== null) {
            $updateData['is_active'] = $command->isActive;
        }

        if ($command->tags !== null) {
            $updateData['tags'] = $command->tags;
        }

        if ($command->metadata !== null) {
            $updateData['metadata'] = $command->metadata;
        }

        $updateData['updated_at'] = now();

        return $updateData;
    }
}
