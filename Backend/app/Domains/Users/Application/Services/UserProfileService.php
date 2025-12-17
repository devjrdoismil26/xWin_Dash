<?php

namespace App\Domains\Users\Application\Services;

use App\Domains\Users\Application\DTOs\UserProfileDTO;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UserProfileService
{
    public function updateProfile(User $user, UserProfileDTO $dto): bool
    {
        return $user->update([
            'avatar' => $dto->avatar,
            'bio' => $dto->bio,
            'phone' => $dto->phone,
            'timezone' => $dto->timezone,
            'preferences' => $dto->preferences,
        ]);
    }

    public function uploadAvatar(User $user, UploadedFile $file): string
    {
        $path = $file->store('avatars', 'public');
        
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }
        
        $user->update(['avatar' => $path]);
        
        return $path;
    }

    public function getPreferences(User $user): array
    {
        return $user->preferences ?? [];
    }
}
