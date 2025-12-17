<?php

namespace App\Domains\Leads\Policies;

use App\Domains\Leads\Domain\Lead;
use App\Models\User; // Supondo que a entidade de domínio exista
use Illuminate\Auth\Access\HandlesAuthorization;

class LeadPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any leads.
     *
     * @param \App\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return true; // Qualquer usuário autenticado pode ver Leads que ele tem acesso
    }

    /**
     * Determine whether the user can view the lead.
     *
     * @param \App\Models\User $user
     * @param Lead             $lead
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Lead $lead)
    {
        // Exemplo: o usuário pode ver o Lead se ele for o proprietário ou um administrador
        return $user->id === $lead->user_id || $user->isAdmin(); // Supondo user_id no Lead e isAdmin() no User
    }

    /**
     * Determine whether the user can create leads.
     *
     * @param \App\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return true; // Qualquer usuário autenticado pode criar Leads
    }

    /**
     * Determine whether the user can update the lead.
     *
     * @param \App\Models\User $user
     * @param Lead             $lead
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Lead $lead)
    {
        return $user->id === $lead->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the lead.
     *
     * @param \App\Models\User $user
     * @param Lead             $lead
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Lead $lead)
    {
        return $user->id === $lead->user_id || $user->isAdmin();
    }
}
