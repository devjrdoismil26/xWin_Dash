<?php

namespace App\Domains\Auth\Application\DTOs;

readonly class LoginDTO
{
    public function __construct(
        public string $email,
        public string $password,
        public bool $remember = false,
        public ?string $device_name = null
    ) {}
}
