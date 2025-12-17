<?php

namespace App\Domains\Aura\Policies;

use App\Domains\Aura\Models\AuraFlow;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AuraFlowPolicy
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
     * Determine whether the user can view any flows.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view aura flows');
    }

    /**
     * Determine whether the user can view the flow.
     */
    public function view(User $user, AuraFlow $auraFlow): bool
    {
        return $user->hasPermissionTo('view aura flow', $auraFlow);
    }

    /**
     * Determine whether the user can create flows.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create aura flow');
    }

    /**
     * Determine whether the user can update the flow.
     */
    public function update(User $user, AuraFlow $auraFlow): bool
    {
        return $user->hasPermissionTo('update aura flow', $auraFlow);
    }

    /**
     * Determine whether the user can delete the flow.
     */
    public function delete(User $user, AuraFlow $auraFlow): bool
    {
        return $user->hasPermissionTo('delete aura flow', $auraFlow);
    }

    /**
     * Determine whether the user can activate the flow.
     */
    public function activate(User $user, AuraFlow $auraFlow): bool
    {
        return $user->hasPermissionTo('activate aura flow', $auraFlow);
    }

    /**
     * Determine whether the user can deactivate the flow.
     */
    public function deactivate(User $user, AuraFlow $auraFlow): bool
    {
        return $user->hasPermissionTo('deactivate aura flow', $auraFlow);
    }

    public function restore(User $user, AuraFlow $auraFlow): bool
    {
        return $user->hasPermissionTo('restore aura flow', $auraFlow);
    }

    public function forceDelete(User $user, AuraFlow $auraFlow): bool
    {
        return $user->hasPermissionTo('force delete aura flow', $auraFlow);
    }
}
