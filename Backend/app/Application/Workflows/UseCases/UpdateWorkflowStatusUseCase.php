<?php

namespace App\Application\Workflows\UseCases;

use App\Application\Workflows\Commands\UpdateWorkflowStatusCommand;
use App\Domains\Workflows\Services\WorkflowService; // Supondo que este serviço exista

class UpdateWorkflowStatusUseCase
{
    protected WorkflowService $workflowService;

    public function __construct(WorkflowService $workflowService)
    {
        $this->workflowService = $workflowService;
    }

    /**
     * Executa o caso de uso para atualizar o status de um workflow.
     *
     * @param UpdateWorkflowStatusCommand $command
     *
     * @return mixed o workflow atualizado
     */
    public function execute(UpdateWorkflowStatusCommand $command)
    {
        return $this->workflowService->updateWorkflowStatus($command->workflowId, $command->newStatus);
    }
}
