<?php

namespace App\Domains\Auth\Application\DTOs;

use Carbon\Carbon;

readonly class TokenDTO
{
    public function __construct(
        public string $name,
        public array $abilities = ['*'],
        public ?Carbon $expires_at = null
    ) {}
}
