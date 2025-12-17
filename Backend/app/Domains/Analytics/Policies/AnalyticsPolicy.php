<?php

namespace App\Domains\Analytics\Policies;

use App\Domains\Analytics\Models\AnalyticReport;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AnalyticsPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any analytic reports.
     *
     * @param \App\Domains\Users\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        // Qualquer usuário autenticado pode ver seus próprios relatórios.
        return true;
    }

    /**
     * Determine whether the user can view the analytic report.
     *
     * @param \App\Domains\Users\Models\User               $user
     * @param \App\Domains\Analytics\Models\AnalyticReport $analyticReport
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, AnalyticReport $analyticReport)
    {
        // O usuário só pode ver o relatório se ele for o criador.
        return $user->id === $analyticReport->user_id;
    }

    /**
     * Determine whether the user can create analytic reports.
     *
     * @param \App\Domains\Users\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        // Qualquer usuário autenticado pode criar relatórios.
        return true;
    }

    /**
     * Determine whether the user can update the analytic report.
     *
     * @param \App\Domains\Users\Models\User               $user
     * @param \App\Domains\Analytics\Models\AnalyticReport $analyticReport
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, AnalyticReport $analyticReport)
    {
        // O usuário só pode atualizar o relatório se ele for o criador.
        return $user->id === $analyticReport->user_id;
    }

    /**
     * Determine whether the user can delete the analytic report.
     *
     * @param \App\Domains\Users\Models\User               $user
     * @param \App\Domains\Analytics\Models\AnalyticReport $analyticReport
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, AnalyticReport $analyticReport)
    {
        // O usuário só pode deletar o relatório se ele for o criador.
        return $user->id === $analyticReport->user_id;
    }
}
