<?php

namespace App\Domains\Auth\Application\Queries;

class ValidateTokenQuery
{
    public function __construct(
        public readonly string $token,
        public readonly ?string $deviceId = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'token' => $this->token,
            'device_id' => $this->deviceId
        ];
    }
}
