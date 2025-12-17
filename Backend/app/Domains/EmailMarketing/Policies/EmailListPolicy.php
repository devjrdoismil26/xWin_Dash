<?php

namespace App\Domains\EmailMarketing\Policies;

use App\Domains\EmailMarketing\Domain\EmailList;
use App\Models\User; // Supondo que a entidade de domínio exista
use Illuminate\Auth\Access\HandlesAuthorization;

class EmailListPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any email lists.
     *
     * @param \App\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return true; // Qualquer usuário autenticado pode ver suas listas
    }

    /**
     * Determine whether the user can view the email list.
     *
     * @param \App\Models\User $user
     * @param EmailList        $emailList
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, EmailList $emailList)
    {
        return $user->id === $emailList->userId;
    }

    /**
     * Determine whether the user can create email lists.
     *
     * @param \App\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return true; // Qualquer usuário autenticado pode criar listas
    }

    /**
     * Determine whether the user can update the email list.
     *
     * @param \App\Models\User $user
     * @param EmailList        $emailList
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, EmailList $emailList)
    {
        return $user->id === $emailList->userId;
    }

    /**
     * Determine whether the user can delete the email list.
     *
     * @param \App\Models\User $user
     * @param EmailList        $emailList
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, EmailList $emailList)
    {
        return $user->id === $emailList->userId;
    }
}
