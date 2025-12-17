<?php

namespace App\Domains\Workflows\Policies;

use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

abstract class BaseWorkflowPolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if (method_exists($user, 'isAdmin') && $user->isAdmin()) {
            return true;
        }

        return null;
    }

    /**
     * Check if user has permission for a specific action.
     */
    protected function hasPermission(User $user, string $permission, $projectId = null): bool
    {
        if (!method_exists($user, 'hasPermissionTo')) {
            return false;
        }

        return $user->hasPermissionTo($permission, $projectId);
    }

    /**
     * Get current project ID from user.
     */
    protected function getCurrentProjectId(User $user): ?int
    {
        return property_exists($user, 'current_project_id') ? $user->current_project_id : null;
    }
}