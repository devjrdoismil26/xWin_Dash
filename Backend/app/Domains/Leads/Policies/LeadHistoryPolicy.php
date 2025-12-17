<?php

namespace App\Domains\Leads\Policies;

use App\Domains\Leads\Domain\LeadHistory;
use App\Models\User; // Supondo que a entidade de domínio exista
use Illuminate\Auth\Access\HandlesAuthorization;

class LeadHistoryPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any lead history.
     *
     * @param \App\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return true; // Qualquer usuário autenticado pode ver históricos de Leads que ele tem acesso
    }

    /**
     * Determine whether the user can view the lead history.
     *
     * @param \App\Models\User $user
     * @param LeadHistory      $leadHistory
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, LeadHistory $leadHistory)
    {
        // Assumindo que o LeadHistory tem um relacionamento com o Lead, e o Lead tem um user_id
        // Ou que o LeadHistory tem um causer_id que pode ser comparado com o user->id
        return $user->id === $leadHistory->causerId; // Exemplo simples
    }

    /**
     * Determine whether the user can create lead history.
     *
     * @param \App\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return true; // Qualquer usuário autenticado pode criar histórico (se tiver permissão para o Lead)
    }

    /**
     * Determine whether the user can update the lead history.
     *
     * @param \App\Models\User $user
     * @param LeadHistory      $leadHistory
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, LeadHistory $leadHistory)
    {
        return $user->id === $leadHistory->causerId; // Exemplo simples
    }

    /**
     * Determine whether the user can delete the lead history.
     *
     * @param \App\Models\User $user
     * @param LeadHistory      $leadHistory
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, LeadHistory $leadHistory)
    {
        return $user->id === $leadHistory->causerId; // Exemplo simples
    }
}
