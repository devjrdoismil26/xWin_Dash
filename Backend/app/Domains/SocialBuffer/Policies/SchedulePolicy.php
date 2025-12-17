<?php

namespace App\Domains\SocialBuffer\Policies;

use App\Domains\SocialBuffer\Models\Schedule;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SchedulePolicy
{
    use HandlesAuthorization;

    public function view(User $user, Schedule $schedule): bool
    {
        return $user->id === $schedule->post->user_id;
    }

    public function update(User $user, Schedule $schedule): bool
    {
        return $user->id === $schedule->post->user_id;
    }

    public function delete(User $user, Schedule $schedule): bool
    {
        return $user->id === $schedule->post->user_id;
    }
}
