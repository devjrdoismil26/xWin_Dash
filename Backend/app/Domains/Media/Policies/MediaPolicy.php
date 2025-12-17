<?php

namespace App\Domains\Media\Policies;

use App\Domains\Media\Models\Media;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MediaPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view media');
    }

    public function view(User $user, Media $media): bool
    {
        return $user->hasPermissionTo('view media file', $media);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('upload media');
    }

    public function update(User $user, Media $media): bool
    {
        return $user->hasPermissionTo('update media file', $media);
    }

    public function delete(User $user, Media $media): bool
    {
        return $user->hasPermissionTo('delete media file', $media);
    }

    public function restore(User $user, Media $media): bool
    {
        return $user->hasPermissionTo('restore media file', $media);
    }

    public function forceDelete(User $user, Media $media): bool
    {
        return $user->hasPermissionTo('force delete media file', $media);
    }
}
