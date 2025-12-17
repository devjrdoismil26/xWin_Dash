<?php

namespace App\Domains\Users\Application\Actions;

use App\Domains\Users\Application\DTOs\UserDTO;
use App\Domains\Users\Application\Services\UserManagementService;
use App\Domains\Users\Events\UserCreated;
use App\Models\User;

class CreateUserAction
{
    public function __construct(
        private UserManagementService $userService
    ) {}

    public function execute(UserDTO $dto): User
    {
        $user = $this->userService->create($dto);
        
        event(new UserCreated($user));
        
        return $user;
    }
}
