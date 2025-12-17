<?php

namespace App\Domains\ADStool\Policies;

use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\AccountModel;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Policy que define as regras de autorização para o model Account.
 */
class AccountPolicy
{
    use HandlesAuthorization;

    /**
     * Determina se o usuário pode visualizar qualquer model.
     */
    public function viewAny(User $user): bool
    {
        // Qualquer usuário logado pode listar as contas que ele mesmo cadastrou.
        return true;
    }

    /**
     * Determina se o usuário pode visualizar o model.
     */
    public function view(User $user, AccountModel $account): bool
    {
        // O usuário só pode ver a conta se ele for o dono dela.
        return $user->id === $account->user_id;
    }

    /**
     * Determina se o usuário pode criar models.
     */
    public function create(User $user): bool
    {
        // Qualquer usuário logado pode criar uma nova conta.
        return true;
    }

    /**
     * Determina se o usuário pode atualizar o model.
     */
    public function update(User $user, AccountModel $account): bool
    {
        // O usuário só pode atualizar a conta se ele for o dono dela.
        return $user->id === $account->user_id;
    }

    /**
     * Determina se o usuário pode deletar o model.
     */
    public function delete(User $user, AccountModel $account): bool
    {
        // O usuário só pode deletar a conta se ele for o dono dela.
        return $user->id === $account->user_id;
    }

    /**
     * Determina se o usuário pode restaurar o model.
     */
    public function restore(User $user, AccountModel $account): bool
    {
        return $user->id === $account->user_id;
    }

    /**
     * Determina se o usuário pode deletar permanentemente o model.
     */
    public function forceDelete(User $user, AccountModel $account): bool
    {
        return $user->id === $account->user_id;
    }
}
