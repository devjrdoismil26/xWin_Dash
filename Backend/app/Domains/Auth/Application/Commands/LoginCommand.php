<?php

namespace App\Domains\Auth\Application\Commands;

class LoginCommand
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly ?string $deviceId = null,
        public readonly ?string $deviceName = null,
        public readonly ?string $ipAddress = null,
        public readonly ?bool $rememberMe = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'password' => $this->password,
            'device_id' => $this->deviceId,
            'device_name' => $this->deviceName,
            'ip_address' => $this->ipAddress,
            'remember_me' => $this->rememberMe
        ];
    }
}
