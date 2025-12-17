<?php

namespace App\Domains\Auth\Application\Commands;

class RefreshTokenCommand
{
    public function __construct(
        public readonly string $refreshToken,
        public readonly ?string $deviceId = null,
        public readonly ?string $ipAddress = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'refresh_token' => $this->refreshToken,
            'device_id' => $this->deviceId,
            'ip_address' => $this->ipAddress
        ];
    }
}
