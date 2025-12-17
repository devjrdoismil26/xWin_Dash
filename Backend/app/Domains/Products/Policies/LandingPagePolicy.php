<?php

namespace App\Domains\Products\Policies;

use App\Domains\Products\Infrastructure\Persistence\Eloquent\LandingPageModel as LandingPage;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LandingPagePolicy
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
     * Determine whether the user can view any landing pages.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view landing pages');
    }

    /**
     * Determine whether the user can view the landing page.
     */
    public function view(User $user, LandingPage $landingPage): bool
    {
        return $user->hasPermissionTo('view landing pages', $landingPage->project_id);
    }

    /**
     * Determine whether the user can create landing pages.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create landing pages', $user->current_project_id);
    }

    /**
     * Determine whether the user can update the landing page.
     */
    public function update(User $user, LandingPage $landingPage): bool
    {
        return $user->hasPermissionTo('update landing pages', $landingPage->project_id);
    }

    /**
     * Determine whether the user can delete the landing page.
     */
    public function delete(User $user, LandingPage $landingPage): bool
    {
        return $user->hasPermissionTo('delete landing pages', $landingPage->project_id);
    }
}
