<?php

namespace App\Application\Workflows\UseCases;

use App\Application\Workflows\Commands\CreateWorkflowCommand;
use App\Domains\Workflows\Services\WorkflowService; // Supondo que este serviço exista

class CreateWorkflowUseCase
{
    protected WorkflowService $workflowService;

    public function __construct(WorkflowService $workflowService)
    {
        $this->workflowService = $workflowService;
    }

    /**
     * Executa o caso de uso para criar um novo workflow.
     *
     * @param CreateWorkflowCommand $command
     *
     * @return mixed o workflow criado
     */
    public function execute(CreateWorkflowCommand $command)
    {
        $data = [
            'name' => $command->name,
            'structure' => $command->structure,
            'description' => $command->description,
        ];

        return $this->workflowService->createWorkflow(
            $command->userId,
            $data
        );
    }
}
