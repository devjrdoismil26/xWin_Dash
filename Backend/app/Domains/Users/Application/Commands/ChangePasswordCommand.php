<?php

namespace App\Domains\Users\Application\Commands;

class ChangePasswordCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $currentPassword,
        public readonly string $newPassword,
        public readonly ?string $reason = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'current_password' => $this->currentPassword,
            'new_password' => $this->newPassword,
            'reason' => $this->reason
        ];
    }
}
