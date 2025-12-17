<?php

namespace App\Domains\Dashboard\Policies;

use App\Domains\Dashboard\Models\DashboardWidget;
use App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\DashboardWidgetModel;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DashboardPolicy
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
     * Determine whether the user can view dashboard metrics.
     *
     * @param \App\Domains\Users\Models\User $user
     *
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        // Verificar se o usuário tem permissão ou é admin/manager
        return $user->hasPermission('dashboard.view') ||
               $user->hasRole(['admin', 'manager']);
    }

    /**
     * Determine whether the user can view the widget.
     */
    public function view(User $user, $widget): bool
    {
        // Aceitar tanto DashboardWidget quanto DashboardWidgetModel
        $widgetModel = $widget instanceof DashboardWidget ? DashboardWidgetModel::findOrFail($widget->id) : $widget;
        
        // Verificar se o usuário tem permissão geral
        if (!$user->hasPermission('dashboard.view') && !$user->hasRole('admin')) {
            return false;
        }

        // Verificar se o widget pertence ao projeto do usuário
        if ($widgetModel->project_id) {
            return $user->hasProjectAccess($widgetModel->project_id);
        }

        // Se não tem project_id, verificar se pertence ao usuário
        return $widgetModel->user_id === $user->id;
    }

    /**
     * Determine whether the user can export dashboard data.
     *
     * @param \App\Domains\Users\Models\User $user
     *
     * @return bool
     */
    public function export(User $user): bool
    {
        return $user->hasPermission('dashboard.export') ||
               $user->hasRole(['admin', 'manager']);
    }

    public function viewLeadsTrend(User $user): bool
    {
        return $user->hasPermission('dashboard.view') ||
               $user->hasRole(['admin', 'manager']);
    }

    public function viewSegmentGrowth(User $user): bool
    {
        return $user->hasPermission('dashboard.view') ||
               $user->hasRole(['admin', 'manager']);
    }

    public function viewScoreDistribution(User $user): bool
    {
        return $user->hasPermission('dashboard.view') ||
               $user->hasRole(['admin', 'manager']);
    }

    public function viewProjectsStats(User $user): bool
    {
        return $user->hasPermission('dashboard.view') ||
               $user->hasRole(['admin', 'manager']);
    }

    public function createWidget(User $user): bool
    {
        return $user->hasPermission('dashboard.create') ||
               $user->hasRole(['admin', 'manager']);
    }

    public function updateWidget(User $user, DashboardWidget $widget): bool
    {
        // Verificar permissão específica
        if (!$user->hasPermission('dashboard.update') && !$user->hasRole('admin')) {
            return false;
        }

        // Verificar se o widget pertence ao projeto do usuário
        if ($widget->project_id) {
            return $user->hasProjectAccess($widget->project_id);
        }

        // Se não tem project_id, verificar se pertence ao usuário
        return $widget->user_id === $user->id;
    }

    public function deleteWidget(User $user, DashboardWidget $widget): bool
    {
        // Verificar permissão específica
        if (!$user->hasPermission('dashboard.delete') && !$user->hasRole('admin')) {
            return false;
        }

        // Verificar se o widget pertence ao projeto do usuário
        if ($widget->project_id) {
            return $user->hasProjectAccess($widget->project_id);
        }

        // Se não tem project_id, verificar se pertence ao usuário
        return $widget->user_id === $user->id;
    }

    /**
     * Determine whether the user can create dashboard resources.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('dashboard.create') ||
               $user->hasRole(['admin', 'manager']);
    }

    /**
     * Determine whether the user can update dashboard resources.
     */
    public function update(User $user, DashboardWidget $widget = null): bool
    {
        // Verificar permissão específica
        if (!$user->hasPermission('dashboard.update') && !$user->hasRole('admin')) {
            return false;
        }

        if ($widget) {
            // Verificar se o widget pertence ao projeto do usuário
            if ($widget->project_id) {
                return $user->hasProjectAccess($widget->project_id);
            }
            // Se não tem project_id, verificar se pertence ao usuário
            return $widget->user_id === $user->id;
        }

        // Para recursos sem instância específica, verificar permissão geral
        return $user->hasPermission('dashboard.update') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete dashboard resources.
     */
    public function delete(User $user, DashboardWidget $widget = null): bool
    {
        // Verificar permissão específica
        if (!$user->hasPermission('dashboard.delete') && !$user->hasRole('admin')) {
            return false;
        }

        if ($widget) {
            // Verificar se o widget pertence ao projeto do usuário
            if ($widget->project_id) {
                return $user->hasProjectAccess($widget->project_id);
            }
            // Se não tem project_id, verificar se pertence ao usuário
            return $widget->user_id === $user->id;
        }

        // Para recursos sem instância específica, verificar permissão geral
        return $user->hasPermission('dashboard.delete') || $user->hasRole('admin');
    }
}
