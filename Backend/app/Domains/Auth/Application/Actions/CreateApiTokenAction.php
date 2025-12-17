<?php

namespace App\Domains\Auth\Application\Actions;

use App\Domains\Auth\Application\DTOs\TokenDTO;
use App\Domains\Auth\Application\Services\TokenManagementService;
use App\Models\User;

class CreateApiTokenAction
{
    public function __construct(
        private TokenManagementService $tokenService
    ) {}

    public function execute(User $user, TokenDTO $dto): string
    {
        return $this->tokenService->createToken($user, $dto);
    }
}
