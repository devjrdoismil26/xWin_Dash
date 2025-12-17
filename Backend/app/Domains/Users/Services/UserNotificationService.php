<?php

namespace App\Domains\Users\Services;

use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Support\Collection;

class UserNotificationService
{
    /**
     * @return Collection<int, UserModel>
     */
    public function getUsersToNotifyForCampaignStatusChange(object $campaign, string $notificationType): Collection
    {
        $users = collect();

        // Always notify the campaign owner
        if (property_exists($campaign, 'creator') && $campaign->creator) {
            $users->push($campaign->creator);
        }

        // Notify project owner if different from campaign owner
        // Notify project owner if different from campaign owner
        if (
            property_exists($campaign, 'project') && $campaign->project &&
            property_exists($campaign->project, 'owner') && $campaign->project->owner &&
            property_exists($campaign, 'created_by') && $campaign->project->owner->id !== $campaign->created_by
        ) {
            $users->push($campaign->project->owner);
        }

        // Get additional users based on notification settings
        // This is a simplified example. Real implementation would check specific notification preferences.
        /*
        $additionalUsers = User::whereHas('notificationSettings', function ($query) use ($notificationType) {
            $query->where('type', $notificationType)
                  ->where('enabled', true);
        })->get();
        */

        // foreach ($additionalUsers as $user) {
        //     // Check if user has access to this project/campaign
        //     if ($this->userHasAccessToCampaign($user, $campaign)) {
        //         $users->push($user);
        //     }
        // }

        return $users->unique('id');
    }

    protected function userHasAccessToCampaign(UserModel $user, object $campaign): bool
    {
        // Check if user owns the campaign or project
        if (
            (property_exists($campaign, 'created_by') && $user->id === $campaign->created_by) ||
            (property_exists($campaign, 'project') && $campaign->project &&
             property_exists($campaign->project, 'owner_id') && $user->id === $campaign->project->owner_id)
        ) {
            return true;
        }

        // Check if user has team access (if team functionality exists)
        // This would depend on your specific access control implementation

        return false;
    }
}
