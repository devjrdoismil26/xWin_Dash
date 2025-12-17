<?php

namespace App\Domains\ADStool\Policies;

use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\ADSCampaign;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ADSCampaignPolicy
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
     * Determine whether the user can view any campaigns.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('adstool.view') ||
               $user->hasPermission('campaigns.view') ||
               $user->hasRole(['admin', 'manager']);
    }

    /**
     * Determine whether the user can view the campaign.
     */
    public function view(User $user, ADSCampaign $campaign): bool
    {
        // Verificar se o usuário tem permissão geral
        if ($user->hasPermission('adstool.view') || $user->hasPermission('campaigns.view') || $user->hasRole('admin')) {
            // Verificar se a campanha pertence ao projeto do usuário
            if ($campaign->project_id) {
                return $user->hasProjectAccess($campaign->project_id);
            }
            // Se não tem project_id, verificar se pertence ao usuário
            return $campaign->user_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create campaigns.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('adstool.create') ||
               $user->hasPermission('campaigns.create') ||
               $user->hasRole(['admin', 'manager']);
    }

    /**
     * Determine whether the user can update the campaign.
     */
    public function update(User $user, ADSCampaign $campaign): bool
    {
        // Verificar permissão específica
        if (!$user->hasPermission('adstool.update') && !$user->hasPermission('campaigns.update') && !$user->hasRole('admin')) {
            return false;
        }

        // Verificar se a campanha pertence ao projeto do usuário
        if ($campaign->project_id) {
            return $user->hasProjectAccess($campaign->project_id);
        }
        // Se não tem project_id, verificar se pertence ao usuário
        return $campaign->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the campaign.
     */
    public function delete(User $user, ADSCampaign $campaign): bool
    {
        // Verificar permissão específica
        if (!$user->hasPermission('adstool.delete') && !$user->hasPermission('campaigns.delete') && !$user->hasRole('admin')) {
            return false;
        }

        // Verificar se a campanha pertence ao projeto do usuário
        if ($campaign->project_id) {
            return $user->hasProjectAccess($campaign->project_id);
        }
        // Se não tem project_id, verificar se pertence ao usuário
        return $campaign->user_id === $user->id;
    }
}
