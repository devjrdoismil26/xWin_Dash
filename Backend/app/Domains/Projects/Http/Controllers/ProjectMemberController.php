<?php

namespace App\Domains\Projects\Http\Controllers;

use App\Domains\Projects\Services\ProjectService;
use App\Http\Controllers\Controller; // Supondo que este serviço exista
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectMemberController extends Controller
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Add a member to a project.
     *
     * @param int     $projectId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function addMember(int $projectId, Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'role' => 'required|string|in:member,admin,viewer',
        ]);

        try {
            $project = \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel::findOrFail($projectId);
            $this->projectService->addMemberToProject(
                $project,
                $request->input('user_id'),
                $request->input('role'),
            );
            return response()->json(['message' => 'Member added successfully.', 'project' => $project->fresh(['members'])]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Update a member's role in a project.
     *
     * @param int     $projectId
     * @param int     $userId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function updateMemberRole(int $projectId, int $userId, Request $request): JsonResponse
    {
        $request->validate([
            'role' => 'required|string|in:member,admin,viewer',
        ]);

        try {
            $project = \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel::findOrFail($projectId);
            $this->projectService->updateProjectMemberRole(
                $project,
                $userId,
                $request->input('role'),
            );
            return response()->json(['message' => 'Member role updated successfully.', 'project' => $project->fresh(['members'])]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Remove a member from a project.
     *
     * @param int $projectId
     * @param int $userId
     *
     * @return JsonResponse
     */
    public function removeMember(int $projectId, int $userId): JsonResponse
    {
        try {
            $project = \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel::findOrFail($projectId);
            $this->projectService->removeMemberFromProject($project, $userId);
            return response()->json(['message' => 'Member removed successfully.', 'project' => $project->fresh(['members'])]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
