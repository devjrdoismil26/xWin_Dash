<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Projects\Models\Project;
use App\Domains\Projects\Services\ProjectService;
use App\Domains\Users\Models\User;
use Workflow\Activity;

class AddOwnerAsMemberActivity extends Activity
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Adiciona o proprietário do projeto como membro.
     *
     * @param Project $project o projeto
     * @param string  $userId  o ID do usuário a ser adicionado como membro
     */
    public function execute(Project $project, string $userId): void
    {
        $user = User::find($userId);
        if ($user) {
            $this->projectService->addMember($project, $user, 'owner');
        }
    }

    /**
     * Compensa a adição do membro, removendo-o do projeto.
     *
     * @param Project $project o projeto
     * @param string  $userId  o ID do usuário a ser removido
     */
    public function compensate(Project $project, string $userId): void
    {
        $user = User::find($userId);
        if ($user) {
            $this->projectService->removeMember($project, $user);
        }
    }
}
