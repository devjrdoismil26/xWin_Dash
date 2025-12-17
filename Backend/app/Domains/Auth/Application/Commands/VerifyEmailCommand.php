<?php

namespace App\Domains\Auth\Application\Commands;

class VerifyEmailCommand
{
    public function __construct(
        public readonly string $token,
        public readonly ?string $ipAddress = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'token' => $this->token,
            'ip_address' => $this->ipAddress
        ];
    }
}
