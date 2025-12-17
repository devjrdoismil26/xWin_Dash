<?php

namespace App\Domains\Users\Application\Commands;

class CreateUserCommand
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
        public readonly ?string $phone = null,
        public readonly ?string $avatar = null,
        public readonly ?array $metadata = null,
        public readonly ?array $preferences = null,
        public readonly ?string $role = 'user',
        public readonly ?bool $isActive = true,
        public readonly ?bool $emailVerified = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'metadata' => $this->metadata,
            'preferences' => $this->preferences,
            'role' => $this->role,
            'is_active' => $this->isActive,
            'email_verified' => $this->emailVerified
        ];
    }
}
