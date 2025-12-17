<?php

namespace App\Domains\SocialBuffer\Policies;

use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\HashtagGroupModel;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class HashtagGroupPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true; // Usuários autenticados podem ver suas próprias hashtags
    }

    public function view(User $user, HashtagGroupModel $hashtagGroup): bool
    {
        return $user->id === $hashtagGroup->user_id;
    }

    public function create(User $user): bool
    {
        return true; // Usuários autenticados podem criar hashtags
    }

    public function update(User $user, HashtagGroupModel $hashtagGroup): bool
    {
        return $user->id === $hashtagGroup->user_id;
    }

    public function delete(User $user, HashtagGroupModel $hashtagGroup): bool
    {
        return $user->id === $hashtagGroup->user_id;
    }
}
