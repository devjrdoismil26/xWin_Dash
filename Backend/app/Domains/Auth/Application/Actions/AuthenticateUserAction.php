<?php

namespace App\Domains\Auth\Application\Actions;

use App\Domains\Auth\Application\DTOs\LoginDTO;
use App\Domains\Auth\Application\Services\AuthenticationService;
use Illuminate\Http\Request;

class AuthenticateUserAction
{
    public function __construct(
        private AuthenticationService $authService
    ) {}

    public function execute(LoginDTO $dto, Request $request): array
    {
        $result = $this->authService->authenticate($dto);
        $this->authService->recordLogin($result['user'], $request);

        return $result;
    }
}
