<?php

namespace App\Domains\Auth\Application\DTOs;

readonly class UserAuthDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public string $email,
        public array $permissions = [],
        public array $roles = []
    ) {}
}
