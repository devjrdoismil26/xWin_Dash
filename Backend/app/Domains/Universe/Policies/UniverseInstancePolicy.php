<?php

namespace App\Domains\Universe\Policies;

use App\Domains\Universe\Models\UniverseInstance;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UniverseInstancePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('universe.view_any') ||
               $user->hasRole(['admin', 'manager']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, UniverseInstance $instance): bool
    {
        // Usuário pode ver se é proprietário
        if ((int) $instance->user_id === (int) $user->id) {
            return true;
        }

        // Ou se tem permissão geral
        if ($user->hasPermission('universe.view_all')) {
            return true;
        }

        // Ou se a instância foi compartilhada com ele
        if ($instance->sharedUsers->contains($user->id)) {
            return true;
        }

        // Ou se é do mesmo projeto e tem permissão
        if (
            $instance->project_id &&
            $user->hasProjectAccess($instance->project_id) &&
            $user->hasPermission('universe.view_project')
        ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if (!$user->hasPermission('universe.create')) {
            return false;
        }

        // Verificar limites de instâncias por usuário
        $currentInstances = UniverseInstance::where('user_id', $user->id)->count();
        $limit = $user->getInstanceLimit();

        return $currentInstances < $limit;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UniverseInstance $instance): bool
    {
        // Apenas proprietário ou admin
        if ((int) $instance->user_id === (int) $user->id) {
            return $user->hasPermission('universe.update');
        }

        // Admin pode editar qualquer instância
        if ($user->hasRole('admin')) {
            return true;
        }

        // Colaboradores com permissão de edição
        if ($instance->sharedUsers->where('pivot.permission', 'edit')->contains($user->id)) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UniverseInstance $instance): bool
    {
        // Apenas proprietário ou admin
        if ((int) $instance->user_id === (int) $user->id) {
            return $user->hasPermission('universe.delete');
        }

        // Admin pode deletar qualquer instância
        if ($user->hasRole('admin')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, UniverseInstance $instance): bool
    {
        return $this->delete($user, $instance);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, UniverseInstance $instance): bool
    {
        return $user->hasRole('admin') &&
               $user->hasPermission('universe.force_delete');
    }

    /**
     * Determine whether the user can share the instance.
     */
    public function share(User $user, UniverseInstance $instance): bool
    {
        if ((int) $instance->user_id === (int) $user->id) {
            return $user->hasPermission('universe.share');
        }

        return false;
    }

    /**
     * Determine whether the user can duplicate the instance.
     */
    public function duplicate(User $user, UniverseInstance $instance): bool
    {
        if (!$this->view($user, $instance)) {
            return false;
        }

        return $this->create($user);
    }

    /**
     * Determine whether the user can access analytics.
     */
    public function viewAnalytics(User $user, UniverseInstance $instance): bool
    {
        if (!$this->view($user, $instance)) {
            return false;
        }

        return $user->hasPermission('universe.view_analytics');
    }

    /**
     * Determine whether the user can export the instance.
     */
    public function export(User $user, UniverseInstance $instance): bool
    {
        if (!$this->view($user, $instance)) {
            return false;
        }

        return $user->hasPermission('universe.export');
    }

    /**
     * Determine whether the user can use AI features.
     */
    public function useAI(User $user, UniverseInstance $instance): bool
    {
        if (!$this->view($user, $instance)) {
            return false;
        }

        return $user->hasPermission('universe.use_ai') &&
               $user->hasFeatureAccess('ai_advanced');
    }

    /**
     * Determine whether the user can manage snapshots.
     */
    public function manageSnapshots(User $user, UniverseInstance $instance): bool
    {
        return $this->update($user, $instance) &&
               $user->hasPermission('universe.manage_snapshots');
    }
}
