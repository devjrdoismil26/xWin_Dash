<?php

namespace App\Domains\Users\Policies;

use App\Domains\Projects\Models\Project;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(UserModel $user, string $ability): bool|null
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models (in this case, view members of a project).
     *
     * @param \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel       $user
     * @param \App\Domains\Projects\Models\Project $project
     *
     * @return bool
     */
    public function viewAny(UserModel $user, Project $project): bool
    {
        return $user->can('view project members', $project);
    }

    /**
     * Determine whether the user can create models (in this case, add members to a project).
     *
     * @param \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel       $user
     * @param \App\Domains\Projects\Models\Project $project
     *
     * @return bool
     */
    public function create(UserModel $user, Project $project): bool
    {
        return $user->can('add project members', $project);
    }

    /**
     * Determine whether the user can delete the model (in this case, remove a member from a project).
     *
     * @param \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel       $user
     * @param \App\Domains\Projects\Models\Project $project
     * @param \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel       $member
     *
     * @return bool
     */
    public function delete(UserModel $user, Project $project, UserModel $member): bool
    {
        return $user->can('remove project members', $project) && $user->id !== $member->id;
    }
}
