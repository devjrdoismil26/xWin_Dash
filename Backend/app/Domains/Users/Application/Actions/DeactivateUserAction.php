<?php

namespace App\Domains\Users\Application\Actions;

use App\Domains\Users\Application\Services\UserManagementService;
use App\Domains\Users\Events\UserDeleted;
use App\Models\User;

class DeactivateUserAction
{
    public function __construct(
        private UserManagementService $userService
    ) {}

    public function execute(User $user, string $reason): bool
    {
        $deactivated = $this->userService->deactivate($user, $reason);
        
        if ($deactivated) {
            $user->tokens()->delete();
            event(new UserDeleted($user));
        }
        
        return $deactivated;
    }
}
