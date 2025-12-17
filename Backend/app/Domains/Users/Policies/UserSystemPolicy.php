<?php

namespace App\Domains\Users\Policies;

use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserSystemPolicy
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
     * Determine whether the user can manage any users in the system.
     *
     * @param \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel $user
     *
     * @return bool
     */
    public function manageUsers(UserModel $user): bool
    {
        return $user->hasPermissionTo('manage users');
    }

    /**
     * Determine whether the user can view user statistics.
     *
     * @param \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel $user
     *
     * @return bool
     */
    public function viewStats(UserModel $user): bool
    {
        return $user->hasPermissionTo('view user statistics');
    }

    /**
     * Determine whether the user can manage projects at a system level.
     *
     * @param \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel $user
     *
     * @return bool
     */
    public function manageProjects(UserModel $user): bool
    {
        return $user->hasPermissionTo('manage system projects');
    }
}
