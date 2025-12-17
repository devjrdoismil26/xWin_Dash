<?php

namespace App\Domains\Leads\Policies;

use App\Domains\Leads\Domain\LeadCustomField;
use App\Models\User; // Supondo que a entidade de domínio exista
use Illuminate\Auth\Access\HandlesAuthorization;

class LeadCustomFieldPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any lead custom fields.
     *
     * @param \App\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return true; // Qualquer usuário autenticado pode ver seus campos personalizados
    }

    /**
     * Determine whether the user can view the lead custom field.
     *
     * @param \App\Models\User $user
     * @param LeadCustomField  $leadCustomField
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, LeadCustomField $leadCustomField)
    {
        return $user->id === $leadCustomField->userId;
    }

    /**
     * Determine whether the user can create lead custom fields.
     *
     * @param \App\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return true; // Qualquer usuário autenticado pode criar campos personalizados
    }

    /**
     * Determine whether the user can update the lead custom field.
     *
     * @param \App\Models\User $user
     * @param LeadCustomField  $leadCustomField
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, LeadCustomField $leadCustomField)
    {
        return $user->id === $leadCustomField->userId;
    }

    /**
     * Determine whether the user can delete the lead custom field.
     *
     * @param \App\Models\User $user
     * @param LeadCustomField  $leadCustomField
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, LeadCustomField $leadCustomField)
    {
        return $user->id === $leadCustomField->userId;
    }
}
