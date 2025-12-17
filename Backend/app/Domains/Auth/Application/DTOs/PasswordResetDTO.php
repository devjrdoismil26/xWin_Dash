<?php

namespace App\Domains\Auth\Application\DTOs;

readonly class PasswordResetDTO
{
    public function __construct(
        public string $email,
        public string $token,
        public string $password,
        public string $password_confirmation
    ) {}
}
