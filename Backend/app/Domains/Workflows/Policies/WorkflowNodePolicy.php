<?php

namespace App\Domains\Workflows\Policies;

use App\Domains\Users\Models\User;
use App\Domains\Workflows\Models\WorkflowNode;

class WorkflowNodePolicy extends BaseWorkflowPolicy
{

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
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return method_exists($user, 'hasPermissionTo') && $user->hasPermissionTo('view workflow nodes');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, WorkflowNode $workflowNode): bool
    {
        return $user->hasPermissionTo('view workflow nodes', $workflowNode->workflow->project_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create workflow nodes', $user->current_project_id);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, WorkflowNode $workflowNode): bool
    {
        return $user->hasPermissionTo('update workflow nodes', $workflowNode->workflow->project_id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, WorkflowNode $workflowNode): bool
    {
        return $user->hasPermissionTo('delete workflow nodes', $workflowNode->workflow->project_id);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, WorkflowNode $workflowNode): bool
    {
        return $user->hasPermissionTo('restore workflow nodes', $workflowNode->workflow->project_id);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, WorkflowNode $workflowNode): bool
    {
        return $user->hasPermissionTo('force delete workflow nodes', $workflowNode->workflow->project_id);
    }
}
