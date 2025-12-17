<?php

namespace App\Domains\Projects\Services;

use App\Domains\Projects\Contracts\ProjectServiceInterface;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel as Project;
use Illuminate\Support\Collection;

class ProjectService implements ProjectServiceInterface
{
    /**
     * Get all projects for administrative purposes.
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, Project>
     */
    public function getAllProjectsForAdmin(): \Illuminate\Database\Eloquent\Collection
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, Project> $projects */
        $projects = Project::with(['owner', 'users'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $projects;
    }

    /**
     * Get a project by its ID.
     *
     * @param int $projectId
     * @return Project|null
     */
    public function getProjectById(int $projectId): ?Project
    {
        return Project::find($projectId);
    }

    /**
     * Delete a project for administrative purposes.
     *
     * @param \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel $project
     */
    public function deleteProjectForAdmin(Project $project): void
    {
        $project->users()->detach();
        $project->delete();
    }

    /**
     * Toggle the active status of a project.
     *
     * @param Project $project
     *
     * @return Project
     */
    public function toggleProjectStatus(Project $project): Project
    {
        $project->is_active = !$project->is_active;
        $project->save();

        return $project;
    }

    /**
     * Get custom fields for a given project.
     *
     * @param Project $project
     *
     * @return Collection<string, mixed>
     */
    public function getProjectCustomFields(Project $project): Collection
    {
        $customFields = $project->customFields ?? collect();
        return $customFields->keyBy('name');
    }

    /**
     * Get all projects for a user with pagination.
     *
     * @param int $userId
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllProjects(int $userId, int $perPage = 15): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return Project::whereHas('members', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->with(['owner', 'members'])->paginate($perPage);
    }

    /**
     * Create a new project.
     *
     * @param int $userId
     * @param array<string, mixed> $data
     * @return Project
     */
    public function createProject(int $userId, array $data): Project
    {
        $data['user_id'] = $userId;
        /** @var Project $project */
        $project = Project::create($data);

        // Add the creator as a member with 'owner' role
        $project->members()->attach($userId, ['role' => 'owner']);

        return $project->load(['owner', 'members']);
    }

    /**
     * Update a project.
     *
     * @param Project $project
     * @param array<string, mixed> $data
     * @return Project
     */
    public function updateProject(Project $project, array $data): Project
    {
        $project->update($data);
        return $project->fresh(['owner', 'members']);
    }

    /**
     * Delete a project.
     *
     * @param Project $project
     * @return bool
     */
    public function deleteProject(Project $project): bool
    {
        return (bool) $project->delete();
    }

    /**
     * Add a member to a project.
     *
     * @param Project $project
     * @param int $userId
     * @param string $role
     * @return void
     */
    public function addMemberToProject(Project $project, int $userId, string $role = 'member'): void
    {
        $project->members()->syncWithoutDetaching([$userId => ['role' => $role]]);
    }

    /**
     * Update a project member role.
     *
     * @param Project $project
     * @param int $userId
     * @param string $role
     * @return void
     */
    public function updateProjectMemberRole(Project $project, int $userId, string $role): void
    {
        $project->members()->updateExistingPivot($userId, ['role' => $role]);
    }

    /**
     * Remove a member from a project.
     *
     * @param Project $project
     * @param int $userId
     * @return void
     */
    public function removeMemberFromProject(Project $project, int $userId): void
    {
        $project->members()->detach($userId);
    }
}
