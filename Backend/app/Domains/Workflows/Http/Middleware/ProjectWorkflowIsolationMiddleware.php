<?php

namespace App\Domains\Workflows\Http\Middleware;

use App\Domains\Workflows\Models\Workflow;
use App\Domains\Workflows\Services\ProjectWorkflowIsolationService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware para garantir isolamento de workflows por projeto.
 */
class ProjectWorkflowIsolationMiddleware
{
    public function __construct(
        private ProjectWorkflowIsolationService $isolationService,
    ) {
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $project = $request->project;

        if (!$user || !property_exists($request, 'project') || !$request->project) {
            return new JsonResponse([
                'message' => 'Usuário e projeto são obrigatórios para workflows.',
            ], 401);
        }

        // Verificar permissões do usuário no projeto
        if (!$this->hasProjectAccess($user, $project)) {
            return new JsonResponse([
                'message' => 'Usuário não tem acesso ao projeto.',
                'user_id' => $user->id,
                'project_id' => $project->id,
            ], 403);
        }

        // Verificar isolamento de workflow específico (se workflow_id estiver na rota)
        $workflowId = $request->route('workflow') ?? $request->route('workflowId');
        if ($workflowId) {
            $workflow = Workflow::find($workflowId);

            if (!$workflow) {
                return new JsonResponse([
                    'message' => 'Workflow não encontrado.',
                    'workflow_id' => $workflowId,
                ], 404);
            }

            if ($workflow->project_id !== $project->id) {
                return new JsonResponse([
                    'message' => 'Workflow não pertence ao projeto atual.',
                    'workflow_id' => $workflowId,
                    'workflow_project_id' => $workflow->project_id,
                    'current_project_id' => $project->id,
                ], 403);
            }

            // Verificar se o usuário tem permissão para acessar este workflow
            if (!$this->hasWorkflowAccess($user, $workflow)) {
                return new JsonResponse([
                    'message' => 'Usuário não tem permissão para acessar este workflow.',
                    'workflow_id' => $workflowId,
                    'user_id' => $user->id,
                ], 403);
            }
        }

        // Verificar limites de execução por projeto
        if (!$this->checkExecutionLimits($project, $user)) {
            return new JsonResponse([
                'message' => 'Limite de execuções de workflow excedido para este projeto.',
                'project_id' => $project->id,
            ], 429);
        }

        // Adicionar contexto completo de isolamento
        $request->merge([
            'isolation_context' => [
                'project_id' => $project->id,
                'user_id' => $user->id,
                'workflow_id' => $workflowId,
                'permissions' => $this->getUserPermissions($user, $project),
                'limits' => $this->getProjectLimits($project),
                'timestamp' => now()->toISOString(),
            ],
        ]);

        return $next($request);
    }

    /**
     * Verifica se o usuário tem acesso ao projeto
     */
    private function hasProjectAccess($user, $project): bool
    {
        try {
            // Verificar se o usuário é membro do projeto
            return $project->users()->where('user_id', $user->id)->exists() ||
                   $project->user_id === $user->id; // Owner do projeto
        } catch (\Exception $e) {
            \Log::error('Erro ao verificar acesso ao projeto', [
                'user_id' => $user->id,
                'project_id' => $project->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Verifica se o usuário tem acesso ao workflow
     */
    private function hasWorkflowAccess($user, $workflow): bool
    {
        try {
            // Verificar se o usuário pode acessar o workflow
            // Por padrão, se tem acesso ao projeto, tem acesso aos workflows
            return $this->hasProjectAccess($user, $workflow->project);
        } catch (\Exception $e) {
            \Log::error('Erro ao verificar acesso ao workflow', [
                'user_id' => $user->id,
                'workflow_id' => $workflow->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Verifica limites de execução do projeto
     */
    private function checkExecutionLimits($project, $user): bool
    {
        try {
            // Verificar limite de execuções simultâneas
            $activeExecutions = \App\Domains\Workflows\Models\WorkflowExecution::where('project_id', $project->id)
                ->where('status', 'running')
                ->count();

            $maxConcurrentExecutions = $project->max_concurrent_workflows ?? 10;

            if ($activeExecutions >= $maxConcurrentExecutions) {
                return false;
            }

            // Verificar limite diário de execuções
            $todayExecutions = \App\Domains\Workflows\Models\WorkflowExecution::where('project_id', $project->id)
                ->whereDate('created_at', today())
                ->count();

            $maxDailyExecutions = $project->max_daily_workflows ?? 100;

            return $todayExecutions < $maxDailyExecutions;
        } catch (\Exception $e) {
            \Log::error('Erro ao verificar limites de execução', [
                'project_id' => $project->id,
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Obtém permissões do usuário no projeto
     */
    private function getUserPermissions($user, $project): array
    {
        try {
            $projectUser = $project->users()->where('user_id', $user->id)->first();

            if (!$projectUser) {
                return ['owner' => $project->user_id === $user->id];
            }

            return [
                'role' => $projectUser->role ?? 'member',
                'permissions' => $projectUser->permissions ?? [],
                'is_owner' => $project->user_id === $user->id
            ];
        } catch (\Exception $e) {
            \Log::error('Erro ao obter permissões do usuário', [
                'user_id' => $user->id,
                'project_id' => $project->id,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Obtém limites do projeto
     */
    private function getProjectLimits($project): array
    {
        try {
            return [
                'max_concurrent_workflows' => $project->max_concurrent_workflows ?? 10,
                'max_daily_workflows' => $project->max_daily_workflows ?? 100,
                'max_workflow_nodes' => $project->max_workflow_nodes ?? 50,
                'max_workflow_execution_time' => $project->max_workflow_execution_time ?? 3600, // 1 hora
            ];
        } catch (\Exception $e) {
            \Log::error('Erro ao obter limites do projeto', [
                'project_id' => $project->id,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }
}
