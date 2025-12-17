<?php

namespace App\Domains\Activity\Application\DTOs;

readonly class ActivityStatsDTO
{
    public function __construct(
        public int $total_activities,
        public array $by_type,
        public array $by_user,
        public array $by_date,
        public array $most_active_entities
    ) {}
}
