<?php

namespace App\Domains\Core\Http\Middleware;

use App\Domains\Projects\Services\ProjectService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// Supondo que este serviço exista

class SetActiveProject
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request                                                                          $request
     * @param \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse) $next
     *
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $projectId = $request->route('projectId'); // Exemplo: obter o ID do projeto da rota

        if ($projectId !== null) {
            /** @var \App\Domains\Projects\Domain\Project|null $project */
            $project = $this->projectService->getProjectById((int)$projectId);

            /** @var \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel $user */
            $user = Auth::user();
            if (!$project || ($project->userId !== Auth::id() && !$user->isAdmin())) { // Verifica se o usuário tem acesso ao projeto
                abort(403, 'Unauthorized project access.');
            }

            // Armazena o projeto ativo em algum lugar acessível globalmente para a requisição
            app()->instance('activeProject', $project);
        }

        return $next($request);
    }
}
