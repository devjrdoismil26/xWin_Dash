<?php

namespace App\Domains\Projects\Policies;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel as Project;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel as LeadCaptureForm;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LeadCaptureFormPolicy
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
     * @param \App\Domains\Users\Models\User       $user
     * @param \App\Domains\Projects\Models\Project $project
     *
     * @return bool
     */
    public function viewAny(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('view lead capture forms', $project);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param \App\Domains\Users\Models\User               $user
     * @param \App\Domains\Projects\Models\LeadCaptureForm $form
     *
     * @return bool
     */
    public function view(User $user, LeadCaptureForm $form): bool
    {
        return $user->hasPermissionTo('view lead capture form', $form);
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
        return $user->hasPermissionTo('create lead capture form', $project);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param \App\Domains\Users\Models\User               $user
     * @param \App\Domains\Projects\Models\LeadCaptureForm $form
     *
     * @return bool
     */
    public function update(User $user, LeadCaptureForm $form): bool
    {
        return $user->hasPermissionTo('update lead capture form', $form);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param \App\Domains\Users\Models\User               $user
     * @param \App\Domains\Projects\Models\LeadCaptureForm $form
     *
     * @return bool
     */
    public function delete(User $user, LeadCaptureForm $form): bool
    {
        return $user->hasPermissionTo('delete lead capture form', $form);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param \App\Domains\Users\Models\User               $user
     * @param \App\Domains\Projects\Models\LeadCaptureForm $form
     *
     * @return bool
     */
    public function restore(User $user, LeadCaptureForm $form): bool
    {
        return $user->hasPermissionTo('restore lead capture form', $form);
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param \App\Domains\Users\Models\User               $user
     * @param \App\Domains\Projects\Models\LeadCaptureForm $form
     *
     * @return bool
     */
    public function forceDelete(User $user, LeadCaptureForm $form): bool
    {
        return $user->hasPermissionTo('force delete lead capture form', $form);
    }
}
