<?php

namespace App\Domains\Products\Policies;

use App\Domains\Products\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel as LeadCaptureForm;
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
        if ($user->isAdmin()) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any lead capture forms.
     */
    public function viewAny(User $user, ?string $projectId = null): bool
    {
        return $user->hasPermissionTo('view lead capture forms', $projectId);
    }

    /**
     * Determine whether the user can view the lead capture form.
     */
    public function view(User $user, LeadCaptureForm $leadCaptureForm): bool
    {
        return $user->hasPermissionTo('view lead capture forms', $leadCaptureForm->project_id);
    }

    /**
     * Determine whether the user can create lead capture forms.
     */
    public function create(User $user, ?string $projectId = null): bool
    {
        return $user->hasPermissionTo('create lead capture forms', $projectId);
    }

    /**
     * Determine whether the user can update the lead capture form.
     */
    public function update(User $user, LeadCaptureForm $leadCaptureForm): bool
    {
        return $user->hasPermissionTo('update lead capture forms', $leadCaptureForm->project_id);
    }

    /**
     * Determine whether the user can delete the lead capture form.
     */
    public function delete(User $user, LeadCaptureForm $leadCaptureForm): bool
    {
        return $user->hasPermissionTo('delete lead capture forms', $leadCaptureForm->project_id);
    }
}
