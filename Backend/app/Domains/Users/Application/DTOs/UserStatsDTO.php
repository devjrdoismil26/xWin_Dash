<?php

namespace App\Domains\Users\Application\DTOs;

readonly class UserStatsDTO
{
    public function __construct(
        public int $total_users,
        public int $active_users,
        public array $by_role,
        public int $new_this_month,
        public float $activity_rate
    ) {}
}
