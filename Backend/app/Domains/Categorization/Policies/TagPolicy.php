<?php

namespace App\Domains\Categorization\Policies;

use App\Domains\Categorization\Infrastructure\Persistence\Eloquent\TagModel as Tag;
use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TagPolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models.
     *
     * @param \App\Domains\Users\Models\User $user
     *
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view tags');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param \App\Domains\Users\Models\User         $user
     * @param \App\Domains\Categorization\Models\Tag $tag
     *
     * @return bool
     */
    public function view(User $user, Tag $tag): bool
    {
        return $user->hasPermissionTo('view tag', $tag);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param \App\Domains\Users\Models\User       $user
     * @param \App\Domains\Projects\Models\Project $project
     *
     * @return bool
     */
    public function create(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('create tag', $project);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param \App\Domains\Users\Models\User         $user
     * @param \App\Domains\Categorization\Models\Tag $tag
     *
     * @return bool
     */
    public function update(User $user, Tag $tag): bool
    {
        return $user->hasPermissionTo('update tag', $tag);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param \App\Domains\Users\Models\User         $user
     * @param \App\Domains\Categorization\Models\Tag $tag
     *
     * @return bool
     */
    public function delete(User $user, Tag $tag): bool
    {
        return $user->hasPermissionTo('delete tag', $tag);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param \App\Domains\Users\Models\User         $user
     * @param \App\Domains\Categorization\Models\Tag $tag
     *
     * @return bool
     */
    public function restore(User $user, Tag $tag): bool
    {
        return $user->hasPermissionTo('restore tag', $tag);
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param \App\Domains\Users\Models\User         $user
     * @param \App\Domains\Categorization\Models\Tag $tag
     *
     * @return bool
     */
    public function forceDelete(User $user, Tag $tag): bool
    {
        return $user->hasPermissionTo('force delete tag', $tag);
    }
}
