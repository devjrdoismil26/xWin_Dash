<?php

namespace App\Application\Projects\UseCases;

use App\Application\Projects\Commands\CreateProjectCommand;
use App\Domains\Projects\Services\ProjectService; // Supondo que este serviço exista

class CreateProjectUseCase
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Executa o caso de uso para criar um novo projeto.
     *
     * @param CreateProjectCommand $command
     *
     * @return mixed o projeto criado
     */
    public function execute(CreateProjectCommand $command)
    {
        return $this->projectService->createProject(
            $command->name,
            $command->description,
            $command->userId,
        );
    }
}
