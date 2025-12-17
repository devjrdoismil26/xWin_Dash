<?php

namespace App\Domains\Auth\Application\Actions;

use App\Domains\Auth\Application\Services\SessionManagementService;
use App\Models\User;

class RevokeSessionAction
{
    public function __construct(
        private SessionManagementService $sessionService
    ) {}

    public function execute(User $user, string $sessionId): bool
    {
        return $this->sessionService->revokeSession($sessionId);
    }
}
