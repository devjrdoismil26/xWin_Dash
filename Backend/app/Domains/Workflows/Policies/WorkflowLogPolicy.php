<?php

namespace App\Domains\Workflows\Policies;

use App\Domains\Users\Models\User;
use App\Domains\Workflows\Models\WorkflowLog;
use Illuminate\Auth\Access\Response;

class WorkflowLogPolicy extends BaseWorkflowPolicy
{

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return method_exists($user, 'hasPermissionTo') && $user->hasPermissionTo('view workflow logs');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, WorkflowLog $workflowLog): bool
    {
        if (!method_exists($user, 'hasPermissionTo')) {
            return false;
        }

        // Check if workflow relationship exists
        $projectId = null;
        if (property_exists($workflowLog, 'workflow') && $workflowLog->workflow) {
            $projectId = $workflowLog->workflow->project_id ?? null;
        }

        return $user->hasPermissionTo('view workflow logs', $projectId);
    }

    /**
     * Determine whether the user can create models.
     * Workflow logs are typically created by the system, not directly by users.
     * If direct creation is allowed, add specific authorization logic.
     */
    public function create(User $user): bool
    {
        // Logs de workflow são tipicamente criados pelo sistema, não diretamente por usuários.
        return false;
    }

    /**
     * Determine whether the user can update the model.
     * Workflow logs are typically immutable.
     */
    public function update(User $user, WorkflowLog $workflowLog): bool
    {
        // Logs de workflow são tipicamente imutáveis. Atualizações são feitas internamente pelo sistema.
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     * Workflow logs are typically immutable.
     */
    public function delete(User $user, WorkflowLog $workflowLog): bool
    {
        // [Decisão de Design] Logs são tipicamente imutáveis. Se a exclusão for necessária
        // adicione a lógica de autorização aqui
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, WorkflowLog $workflowLog): bool
    {
        if (!method_exists($user, 'hasPermissionTo')) {
            return false;
        }

        $projectId = null;
        if (property_exists($workflowLog, 'workflow') && $workflowLog->workflow) {
            $projectId = $workflowLog->workflow->project_id ?? null;
        }

        return $user->hasPermissionTo('restore workflow logs', $projectId);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, WorkflowLog $workflowLog): bool
    {
        if (!method_exists($user, 'hasPermissionTo')) {
            return false;
        }

        $projectId = null;
        if (property_exists($workflowLog, 'workflow') && $workflowLog->workflow) {
            $projectId = $workflowLog->workflow->project_id ?? null;
        }

        return $user->hasPermissionTo('force delete workflow logs', $projectId);
    }
}
