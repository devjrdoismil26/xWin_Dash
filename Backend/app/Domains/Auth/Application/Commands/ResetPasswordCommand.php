<?php

namespace App\Domains\Auth\Application\Commands;

class ResetPasswordCommand
{
    public function __construct(
        public readonly string $token,
        public readonly string $email,
        public readonly string $password,
        public readonly string $passwordConfirmation,
        public readonly ?string $ipAddress = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'token' => $this->token,
            'email' => $this->email,
            'password' => $this->password,
            'password_confirmation' => $this->passwordConfirmation,
            'ip_address' => $this->ipAddress
        ];
    }
}
