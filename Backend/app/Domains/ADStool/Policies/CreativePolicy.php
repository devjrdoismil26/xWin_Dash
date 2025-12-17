<?php

namespace App\Domains\ADStool\Policies;

use App\Domains\ADStool\Models\Creative;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Policy que define as regras de autorização para o model Creative.
 */
class CreativePolicy
{
    use HandlesAuthorization;

    /**
     * Determina se o usuário pode visualizar qualquer model.
     *
     * @param User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return true;
    }

    /**
     * Determina se o usuário pode visualizar o model.
     *
     * @param User                     $user
     * @param \App\Domains\ADStool\Models\Creative $creative
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Creative $creative)
    {
        // O criativo pertence a uma campanha, que pertence ao usuário
        return $creative->campaign && $user->id == $creative->campaign->user_id;
    }

    /**
     * Determina se o usuário pode criar models.
     *
     * @param User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determina se o usuário pode atualizar o model.
     *
     * @param User                     $user
     * @param \App\Domains\ADStool\Models\Creative $creative
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Creative $creative)
    {
        return $creative->campaign && $user->id == $creative->campaign->user_id;
    }

    /**
     * Determina se o usuário pode deletar o model.
     *
     * @param User                     $user
     * @param \App\Domains\ADStool\Models\Creative $creative
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Creative $creative)
    {
        return $creative->campaign && $user->id == $creative->campaign->user_id;
    }

    /**
     * Determina se o usuário pode restaurar o model.
     *
     * @param User                     $user
     * @param \App\Domains\ADStool\Models\Creative $creative
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Creative $creative)
    {
        return $creative->campaign && $user->id == $creative->campaign->user_id;
    }

    /**
     * Determina se o usuário pode deletar permanentemente o model.
     *
     * @param User                     $user
     * @param \App\Domains\ADStool\Models\Creative $creative
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Creative $creative)
    {
        return $creative->campaign && $user->id == $creative->campaign->user_id;
    }
}
