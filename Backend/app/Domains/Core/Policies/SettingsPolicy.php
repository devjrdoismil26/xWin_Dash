<?php

namespace App\Domains\Core\Policies;

use App\Domains\Settings\Models\Setting;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SettingsPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any settings.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('settings.view') ||
               $user->hasRole(['admin', 'manager']);
    }

    /**
     * Determine whether the user can view the setting.
     */
    public function view(User $user, Setting $setting): bool
    {
        // Usuário pode ver se tem permissão geral ou se é admin
        if ($user->hasPermission('settings.view') || $user->hasRole('admin')) {
            return true;
        }

        // Verificar se o setting pertence ao projeto do usuário
        if ($setting->project_id) {
            return $user->hasProjectAccess($setting->project_id);
        }

        // Settings globais apenas para admins
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can create settings.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('settings.create') ||
               $user->hasRole(['admin', 'manager']);
    }

    /**
     * Determine whether the user can update the setting.
     */
    public function update(User $user, Setting $setting): bool
    {
        // Admin pode atualizar qualquer setting
        if ($user->hasRole('admin')) {
            return true;
        }

        // Verificar permissão específica
        if (!$user->hasPermission('settings.update')) {
            return false;
        }

        // Verificar se o setting pertence ao projeto do usuário
        if ($setting->project_id) {
            return $user->hasProjectAccess($setting->project_id);
        }

        // Settings globais apenas para admins
        return false;
    }

    /**
     * Determine whether the user can delete the setting.
     */
    public function delete(User $user, Setting $setting): bool
    {
        // Admin pode deletar qualquer setting
        if ($user->hasRole('admin')) {
            return true;
        }

        // Verificar permissão específica
        if (!$user->hasPermission('settings.delete')) {
            return false;
        }

        // Verificar se o setting pertence ao projeto do usuário
        if ($setting->project_id) {
            return $user->hasProjectAccess($setting->project_id);
        }

        // Settings globais apenas para admins
        return false;
    }
}
