<?php

namespace App\Domains\Integrations\Policies;

use App\Domains\Integrations\Models\Integration;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class IntegrationPolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any integrations.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('integrations.view') ||
               $user->hasRole(['admin', 'manager']);
    }

    /**
     * Determine whether the user can view the integration.
     */
    public function view(User $user, Integration $integration): bool
    {
        // Verificar se o usuário tem permissão geral
        if ($user->hasPermission('integrations.view') || $user->hasRole('admin')) {
            // Verificar se a integração pertence ao projeto do usuário
            if ($integration->project_id) {
                return $user->hasProjectAccess($integration->project_id);
            }
            // Se não tem project_id, verificar se pertence ao usuário
            return $integration->user_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create integrations.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('integrations.create') ||
               $user->hasRole(['admin', 'manager']);
    }

    /**
     * Determine whether the user can update the integration.
     */
    public function update(User $user, Integration $integration): bool
    {
        // Verificar permissão específica
        if (!$user->hasPermission('integrations.update') && !$user->hasRole('admin')) {
            return false;
        }

        // Verificar se a integração pertence ao projeto do usuário
        if ($integration->project_id) {
            return $user->hasProjectAccess($integration->project_id);
        }
        // Se não tem project_id, verificar se pertence ao usuário
        return $integration->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the integration.
     */
    public function delete(User $user, Integration $integration): bool
    {
        // Verificar permissão específica
        if (!$user->hasPermission('integrations.delete') && !$user->hasRole('admin')) {
            return false;
        }

        // Verificar se a integração pertence ao projeto do usuário
        if ($integration->project_id) {
            return $user->hasProjectAccess($integration->project_id);
        }
        // Se não tem project_id, verificar se pertence ao usuário
        return $integration->user_id === $user->id;
    }

    /**
     * Determine whether the user can test the integration connection.
     */
    public function testConnection(User $user, Integration $integration): bool
    {
        return $this->update($user, $integration);
    }

    /**
     * Determine whether the user can sync the integration.
     */
    public function sync(User $user, Integration $integration): bool
    {
        return $this->update($user, $integration);
    }

    /**
     * Determine whether the user can view integration logs.
     */
    public function viewLogs(User $user, Integration $integration): bool
    {
        return $this->view($user, $integration);
    }
}
