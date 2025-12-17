<?php

namespace App\Domains\Aura\Policies;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AuraConnectionPolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        // Super admins têm acesso total
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return null; // Continua para verificações específicas
    }

    /**
     * Determine whether the user can view any connections.
     */
    public function viewAny(User $user): bool
    {
        // Permite visualizar se tem permissão ou é membro do projeto
        return $user->hasAuraPermission('aura.connections.view') ||
               $user->hasRole(['admin', 'agent']);
    }

    /**
     * Determine whether the user can view the connection.
     */
    public function view(User $user, AuraConnectionModel $auraConnection): bool
    {
        // Pode ver se é dono da conexão ou tem permissão
        return $auraConnection->created_by === $user->id ||
               $user->hasAuraPermission('aura.connections.view') ||
               $user->hasRole(['admin', 'agent']);
    }

    /**
     * Determine whether the user can create connections.
     */
    public function create(User $user): bool
    {
        // Pode criar se tem permissão ou é admin/agent
        return $user->hasAuraPermission('aura.connections.create') ||
               $user->hasRole(['admin', 'agent']);
    }

    /**
     * Determine whether the user can update the connection.
     */
    public function update(User $user, AuraConnectionModel $auraConnection): bool
    {
        // Pode editar se é dono ou tem permissão específica
        return $auraConnection->created_by === $user->id ||
               $user->hasAuraPermission('aura.connections.update') ||
               $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the connection.
     */
    public function delete(User $user, AuraConnectionModel $auraConnection): bool
    {
        // Pode deletar se é dono ou admin
        return $auraConnection->created_by === $user->id ||
               $user->hasAuraPermission('aura.connections.delete') ||
               $user->hasRole('admin');
    }

    /**
     * Determine whether the user can connect the connection.
     */
    public function connect(User $user, AuraConnectionModel $auraConnection): bool
    {
        // Pode conectar se é dono ou tem permissão
        return $auraConnection->created_by === $user->id ||
               $user->hasAuraPermission('aura.connections.manage') ||
               $user->hasRole(['admin', 'agent']);
    }

    /**
     * Determine whether the user can disconnect the connection.
     */
    public function disconnect(User $user, AuraConnectionModel $auraConnection): bool
    {
        // Pode desconectar se é dono ou tem permissão
        return $auraConnection->created_by === $user->id ||
               $user->hasAuraPermission('aura.connections.manage') ||
               $user->hasRole(['admin', 'agent']);
    }

    /**
     * Determine whether the user can handle webhooks for the connection.
     */
    public function webhook(User $user, AuraConnectionModel $auraConnection): bool
    {
        // Webhook pode ser processado se é dono ou tem permissão
        return $auraConnection->created_by === $user->id ||
               $user->hasAuraPermission('aura.webhooks.process') ||
               $user->hasRole(['admin', 'agent']);
    }

    public function restore(User $user, AuraConnectionModel $auraConnection): bool
    {
        // Pode restaurar se é admin
        return $user->hasAuraPermission('aura.connections.restore') ||
               $user->hasRole('admin');
    }

    public function forceDelete(User $user, AuraConnectionModel $auraConnection): bool
    {
        // Pode forçar deleção apenas se é admin
        return $user->hasAuraPermission('aura.connections.force-delete') ||
               $user->hasRole('admin');
    }
}
