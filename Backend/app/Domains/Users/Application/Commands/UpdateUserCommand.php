<?php

namespace App\Domains\Users\Application\Commands;

class UpdateUserCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $name = null,
        public readonly ?string $email = null,
        public readonly ?string $phone = null,
        public readonly ?string $avatar = null,
        public readonly ?array $metadata = null,
        public readonly ?array $preferences = null,
        public readonly ?string $role = null,
        public readonly ?bool $isActive = null,
        public readonly ?bool $emailVerified = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'user_id' => $this->userId,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'metadata' => $this->metadata,
            'preferences' => $this->preferences,
            'role' => $this->role,
            'is_active' => $this->isActive,
            'email_verified' => $this->emailVerified
        ], function ($value) {
            return $value !== null;
        });
    }
}
