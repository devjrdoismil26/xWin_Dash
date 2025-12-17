<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Projects\Models\Project;
use App\Domains\Projects\Services\ProjectService;
use Workflow\Activity;

class CreateProjectActivity extends Activity
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Cria um novo projeto no sistema.
     *
     * @param array<string, mixed> $projectData dados do projeto (ex: name, user_id)
     *
     * @return Project o projeto criado
     */
    public function execute(array $projectData): Project
    {
        return $this->projectService->createProject($projectData);
    }

    /**
     * Compensa a criação do projeto, excluindo-o.
     *
     * @param Project $project o projeto a ser compensado
     */
    public function compensate(Project $project): void
    {
        $this->projectService->deleteProject($project);
    }
}
