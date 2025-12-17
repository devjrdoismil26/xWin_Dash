<?php

namespace App\Domains\Aura\Policies;

use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AuraStatsPolicy
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
     * Determine whether the user can view any stats.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view aura stats');
    }
}
