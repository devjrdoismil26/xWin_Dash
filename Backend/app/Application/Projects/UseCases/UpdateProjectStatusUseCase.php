<?php

namespace App\Application\Projects\UseCases;

use App\Application\Projects\Commands\UpdateProjectStatusCommand;
use App\Domains\Projects\Services\ProjectService; // Supondo que este serviço exista

class UpdateProjectStatusUseCase
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Executa o caso de uso para atualizar o status de um projeto.
     *
     * @param UpdateProjectStatusCommand $command
     *
     * @return mixed o projeto atualizado
     */
    public function execute(UpdateProjectStatusCommand $command)
    {
        return $this->projectService->updateProjectStatus($command->projectId, $command->newStatus);
    }
}
