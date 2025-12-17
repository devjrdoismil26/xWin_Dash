<?php

namespace App\Domains\Projects\Policies;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any projects.
     */
    public function viewAny(UserModel $user): bool
    {
        return true; // Todos os usuários podem ver a lista de projetos que têm acesso
    }

    /**
     * Determine whether the user can view the project.
     */
    public function view(UserModel $user, ProjectModel $project): bool
    {
        return $project->isAccessibleBy($user->id);
    }

    /**
     * Determine whether the user can create projects.
     */
    public function create(UserModel $user): bool
    {
        // Verificar se o usuário tem permissão para criar projetos
        return $user->hasPermissionTo('create_projects') || $user->isAdmin();
    }

    /**
     * Determine whether the user can update the project.
     */
    public function update(UserModel $user, ProjectModel $project): bool
    {
        // Apenas o dono do projeto ou admins podem editar
        return $project->isOwnedBy($user->id) || $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the project.
     */
    public function delete(UserModel $user, ProjectModel $project): bool
    {
        // Apenas o dono do projeto ou super-admins podem excluir
        return $project->isOwnedBy($user->id) || $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can restore the project.
     */
    public function restore(UserModel $user, ProjectModel $project): bool
    {
        return $this->delete($user, $project);
    }

    /**
     * Determine whether the user can permanently delete the project.
     */
    public function forceDelete(UserModel $user, ProjectModel $project): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can manage project members.
     */
    public function manageMembers(UserModel $user, ProjectModel $project): bool
    {
        return $project->isOwnedBy($user->id) || $user->isAdmin();
    }

    /**
     * Determine whether the user can manage project settings.
     */
    public function manageSettings(UserModel $user, ProjectModel $project): bool
    {
        return $project->isOwnedBy($user->id) || $user->isAdmin();
    }

    /**
     * Determine whether the user can view project analytics.
     */
    public function viewAnalytics(UserModel $user, ProjectModel $project): bool
    {
        return $project->isAccessibleBy($user->id);
    }
}
