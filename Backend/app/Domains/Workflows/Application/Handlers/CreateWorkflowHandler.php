<?php

namespace App\Domains\Workflows\Application\Handlers;

use App\Domains\Workflows\Application\Commands\CreateWorkflowCommand;
use App\Domains\Workflows\Domain\Repositories\WorkflowRepositoryInterface;
use App\Domains\Workflows\Domain\Services\WorkflowServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Workflows\Domain\Events\WorkflowCreatedEvent;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowId;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowStatus;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowType;
use App\Domains\Workflows\Domain\Exceptions\WorkflowCreationException;
use Illuminate\Support\Facades\Log;

class CreateWorkflowHandler
{
    public function __construct(
        private WorkflowRepositoryInterface $workflowRepository,
        private WorkflowServiceInterface $workflowService,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function handle(CreateWorkflowCommand $command): void
    {
        try {
            // Validar regras de negócio
            if (!$this->workflowService->canCreateWorkflow($command->userId)) {
                throw new WorkflowCreationException("User cannot create more workflows");
            }

            // Criar o workflow
            $workflow = $this->workflowRepository->create([
                'user_id' => $command->userId,
                'name' => $command->name,
                'description' => $command->description,
                'type' => $command->type ? new WorkflowType($command->type) : null,
                'configuration' => $command->configuration,
                'nodes' => $command->nodes,
                'connections' => $command->connections,
                'status' => new WorkflowStatus($command->status),
                'is_active' => $command->isActive,
                'tags' => $command->tags,
                'metadata' => $command->metadata
            ]);

            // Configurar nós padrão se necessário
            if (empty($command->nodes)) {
                $this->workflowService->createDefaultNodes($workflow);
            }

            // Disparar evento de criação
            $this->eventDispatcher->dispatch(
                new WorkflowCreatedEvent(
                    $workflow->getId(),
                    $command->userId,
                    $command->toArray()
                )
            );

            Log::info('Workflow created successfully', [
                'workflow_id' => $workflow->getId(),
                'user_id' => $command->userId,
                'name' => $command->name
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create workflow', [
                'user_id' => $command->userId,
                'name' => $command->name,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
