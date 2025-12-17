<?php

namespace App\Domains\Auth\Application\Commands;

class ForgotPasswordCommand
{
    public function __construct(
        public readonly string $email,
        public readonly ?string $ipAddress = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'ip_address' => $this->ipAddress
        ];
    }
}
