<?php

namespace App\Domains\Projects\Http\Controllers;

use App\Domains\Core\Http\Controllers\Controller;
use App\Domains\Projects\Http\Resources\ProjectResource;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel as Project;
use App\Domains\Projects\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectManagementController extends Controller
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
        // Autorização para todas as ações de gerenciamento de projetos
        $this->authorizeResource(Project::class, 'project');
    }

    /**
     * Get all projects (admin only).
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $projects = $this->projectService->getAllProjectsForAdmin();

            return ProjectResource::collection($projects)
                ->additional(['message' => 'Projetos listados com sucesso.'])->response();
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao carregar projetos.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a project (admin only).
     */
    public function destroy(string $projectId): JsonResponse
    {
        try {
            $project = \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel::findOrFail($projectId);

            $this->projectService->deleteProjectForAdmin($project);

            return response()->json([
                'message' => 'Projeto deletado com sucesso.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao deletar projeto.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
