<?php

namespace App\Domains\Users\Application\DTOs;

readonly class UserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public ?string $password,
        public string $role_id,
        public bool $is_active = true,
        public array $metadata = []
    ) {}
}
