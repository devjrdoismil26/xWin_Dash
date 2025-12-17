<?php

namespace App\Domains\Auth\Application\Commands;

class LogoutCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $token = null,
        public readonly bool $logoutAllSessions = false,
        public readonly ?string $deviceId = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'token' => $this->token,
            'logout_all_sessions' => $this->logoutAllSessions,
            'device_id' => $this->deviceId
        ];
    }
}
