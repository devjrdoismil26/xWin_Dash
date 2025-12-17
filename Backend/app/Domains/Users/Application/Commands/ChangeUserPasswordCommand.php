<?php

namespace App\Domains\Users\Application\Commands;

class ChangeUserPasswordCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $currentPassword,
        public readonly string $newPassword,
        public readonly bool $logoutOtherSessions = true
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'current_password' => $this->currentPassword,
            'new_password' => $this->newPassword,
            'logout_other_sessions' => $this->logoutOtherSessions
        ];
    }
}
