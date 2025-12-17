<?php

namespace App\Domains\Aura\Policies;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AuraChatPolicy
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
     * Determine whether the user can view any chats.
     */
    public function viewAny(User $user): bool
    {
        // Agentes e admins podem ver chats
        return $user->hasAuraPermission('aura.chats.view') ||
               $user->hasRole(['admin', 'agent']);
    }

    /**
     * Determine whether the user can view the chat.
     */
    public function view(User $user, AuraChatModel $auraChat): bool
    {
        // Pode ver se está atribuído ou tem permissão
        return $auraChat->assigned_to_user_id === $user->id ||
               $user->hasAuraPermission('aura.chats.view') ||
               $user->hasRole(['admin', 'agent']);
    }

    /**
     * Determine whether the user can send messages in the chat.
     */
    public function sendMessage(User $user, AuraChatModel $auraChat): bool
    {
        // Pode enviar mensagem se está atribuído ou é agente/admin
        return $auraChat->assigned_to_user_id === $user->id ||
               $user->hasAuraPermission('aura.chats.send-message') ||
               $user->hasRole(['admin', 'agent']);
    }

    /**
     * Determine whether the user can assign the chat.
     */
    public function assign(User $user, AuraChatModel $auraChat): bool
    {
        // Apenas admins e supervisores podem atribuir chats
        return $user->hasAuraPermission('aura.chats.assign') ||
               $user->hasRole(['admin', 'supervisor']);
    }

    /**
     * Determine whether the user can close the chat.
     */
    public function close(User $user, AuraChatModel $auraChat): bool
    {
        // Pode fechar se está atribuído ou é admin
        return $auraChat->assigned_to_user_id === $user->id ||
               $user->hasAuraPermission('aura.chats.close') ||
               $user->hasRole(['admin', 'supervisor']);
    }

    /**
     * Determine whether the user can link a lead to the chat.
     */
    public function linkLead(User $user, AuraChatModel $auraChat): bool
    {
        // Agentes e admins podem vincular leads
        return $user->hasAuraPermission('aura.chats.link-lead') ||
               $user->hasRole(['admin', 'agent']);
    }

    /**
     * Determine whether the user can start a flow for the chat.
     */
    public function startFlow(User $user, AuraChatModel $auraChat): bool
    {
        // Agentes e admins podem iniciar fluxos
        return $auraChat->assigned_to_user_id === $user->id ||
               $user->hasAuraPermission('aura.flows.start') ||
               $user->hasRole(['admin', 'agent']);
    }
}
