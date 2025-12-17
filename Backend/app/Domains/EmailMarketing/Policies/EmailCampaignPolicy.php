<?php

namespace App\Domains\EmailMarketing\Policies;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignModel;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EmailCampaignPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any email campaigns.
     *
     * @param \App\Domains\Users\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->hasPermission('email_marketing.view') ||
               $user->hasRole(['admin', 'manager']);
    }

    /**
     * Determine whether the user can view the email campaign.
     *
     * @param \App\Domains\Users\Models\User $user
     * @param EmailCampaign|EmailCampaignModel $emailCampaign
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, $emailCampaign)
    {
        // Se for Domain Model, usar userId
        if ($emailCampaign instanceof EmailCampaign) {
            return $user->id === $emailCampaign->userId;
        }
        
        // Se for Eloquent Model, verificar user_id e project_id
        if ($emailCampaign instanceof EmailCampaignModel) {
            if ($user->id !== $emailCampaign->created_by) {
                return false;
            }
            // Verificar acesso ao projeto
            if ($emailCampaign->project_id) {
                return $user->hasProjectAccess($emailCampaign->project_id);
            }
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can create email campaigns.
     *
     * @param \App\Domains\Users\Models\User $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->hasPermission('email_marketing.create') ||
               $user->hasRole(['admin', 'manager']);
    }

    /**
     * Determine whether the user can update the email campaign.
     *
     * @param \App\Domains\Users\Models\User $user
     * @param EmailCampaign|EmailCampaignModel $emailCampaign
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, $emailCampaign)
    {
        // Se for Domain Model, usar userId
        if ($emailCampaign instanceof EmailCampaign) {
            return $user->id === $emailCampaign->userId;
        }
        
        // Se for Eloquent Model, verificar user_id e project_id
        if ($emailCampaign instanceof EmailCampaignModel) {
            if ($user->id !== $emailCampaign->created_by) {
                return false;
            }
            // Verificar acesso ao projeto
            if ($emailCampaign->project_id) {
                return $user->hasProjectAccess($emailCampaign->project_id);
            }
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can delete the email campaign.
     *
     * @param \App\Domains\Users\Models\User $user
     * @param EmailCampaign|EmailCampaignModel $emailCampaign
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, $emailCampaign)
    {
        // Se for Domain Model, usar userId
        if ($emailCampaign instanceof EmailCampaign) {
            return $user->id === $emailCampaign->userId;
        }
        
        // Se for Eloquent Model, verificar user_id e project_id
        if ($emailCampaign instanceof EmailCampaignModel) {
            if ($user->id !== $emailCampaign->created_by) {
                return false;
            }
            // Verificar acesso ao projeto
            if ($emailCampaign->project_id) {
                return $user->hasProjectAccess($emailCampaign->project_id);
            }
            return true;
        }
        
        return false;
    }
}
