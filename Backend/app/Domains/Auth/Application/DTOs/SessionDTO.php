<?php

namespace App\Domains\Auth\Application\DTOs;

use Carbon\Carbon;

readonly class SessionDTO
{
    public function __construct(
        public string $id,
        public string $ip_address,
        public string $user_agent,
        public Carbon $last_activity,
        public bool $is_current = false
    ) {}
}
