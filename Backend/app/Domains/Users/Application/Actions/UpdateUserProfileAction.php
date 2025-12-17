<?php

namespace App\Domains\Users\Application\Actions;

use App\Domains\Users\Application\DTOs\UserProfileDTO;
use App\Domains\Users\Application\Services\UserProfileService;
use App\Domains\Users\Events\UserUpdated;
use App\Models\User;

class UpdateUserProfileAction
{
    public function __construct(
        private UserProfileService $profileService
    ) {}

    public function execute(User $user, UserProfileDTO $dto): bool
    {
        $updated = $this->profileService->updateProfile($user, $dto);
        
        if ($updated) {
            event(new UserUpdated($user));
        }
        
        return $updated;
    }
}
