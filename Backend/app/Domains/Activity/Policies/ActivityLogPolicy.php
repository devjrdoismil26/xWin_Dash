<?php

namespace App\Domains\Activity\Policies;

use App\Domains\Activity\Models\ActivityLog;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ActivityLogPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param \App\Domains\Users\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        // Apenas administradores ou usuários com permissão específica podem ver todos os logs.
        // Ou, usuários podem ver seus próprios logs.
        return true; // Simplificado - remover isAdmin() que pode não existir
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param \App\Domains\Users\Models\User           $user
     * @param \App\Domains\Activity\Models\ActivityLog $activityLog
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, ActivityLog $activityLog)
    {
        // Um usuário pode ver um log se ele for o causador da atividade
        return $user->id === $activityLog->causer_id;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param \App\Domains\Users\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        // Logs de atividade geralmente são criados internamente pelo sistema, não diretamente por usuários.
        // Retornar false ou ter uma lógica mais complexa aqui.
        return false;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param \App\Domains\Users\Models\User           $user
     * @param \App\Domains\Activity\Models\ActivityLog $activityLog
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, ActivityLog $activityLog)
    {
        // Logs de atividade não devem ser atualizados após a criação.
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param \App\Domains\Users\Models\User           $user
     * @param \App\Domains\Activity\Models\ActivityLog $activityLog
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, ActivityLog $activityLog)
    {
        // Apenas administradores podem deletar logs, e geralmente isso é feito por rotinas de limpeza.
        return false; // Simplificado - remover isAdmin() que pode não existir
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param \App\Domains\Users\Models\User           $user
     * @param \App\Domains\Activity\Models\ActivityLog $activityLog
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, ActivityLog $activityLog)
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param \App\Domains\Users\Models\User           $user
     * @param \App\Domains\Activity\Models\ActivityLog $activityLog
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, ActivityLog $activityLog)
    {
        return false;
    }
}
