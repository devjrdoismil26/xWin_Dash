<?php

namespace App\Domains\Workflows\Policies;

use App\Domains\Users\Models\User;
use App\Domains\Workflows\Models\Workflow;
use App\Domains\Workflows\Models\WorkflowNode;

class WorkflowPolicy extends BaseWorkflowPolicy
{

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $this->hasPermission($user, 'view workflows');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Workflow $workflow): bool
    {
        return $this->hasPermission($user, 'view workflows', $workflow->project_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        $projectId = $this->getCurrentProjectId($user);
        return $this->hasPermission($user, 'create workflows', $projectId);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Workflow $workflow): bool
    {
        return $this->hasPermission($user, 'update workflows', $workflow->project_id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Workflow $workflow): bool
    {
        return $this->hasPermission($user, 'delete workflows', $workflow->project_id);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Workflow $workflow): bool
    {
        return $this->hasPermission($user, 'restore workflows', $workflow->project_id);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Workflow $workflow): bool
    {
        return $this->hasPermission($user, 'force delete workflows', $workflow->project_id);
    }

    /**
     * Determine whether the user can execute the workflow.
     */
    public function execute(User $user, Workflow $workflow): bool
    {
        return $this->hasPermission($user, 'execute workflows', $workflow->project_id);
    }

    /**
     * Determine whether the user can save the workflow definition.
     */
    public function saveDefinition(User $user, Workflow $workflow): bool
    {
        return $this->hasPermission($user, 'save workflow definition', $workflow->project_id);
    }

    /**
     * Determine whether the user can simulate the workflow.
     */
    public function simulate(User $user): bool
    {
        return $this->hasPermission($user, 'simulate workflows');
    }

    /**
     * Determine whether the user can create a workflow node.
     */
    public function createNode(User $user, Workflow $workflow): bool
    {
        return $this->hasPermission($user, 'create workflow nodes', $workflow->project_id);
    }

    /**
     * Determine whether the user can update a workflow node.
     */
    public function updateNode(User $user, WorkflowNode $node): bool
    {
        $workflow = property_exists($node, 'workflow') ? $node->workflow : null;
        return $workflow && $this->hasPermission($user, 'update workflow nodes', $workflow->project_id);
    }

    /**
     * Determine whether the user can delete a workflow node.
     */
    public function deleteNode(User $user, WorkflowNode $node): bool
    {
        $workflow = property_exists($node, 'workflow') ? $node->workflow : null;
        return $workflow && $this->hasPermission($user, 'delete workflow nodes', $workflow->project_id);
    }
}
