<?php

namespace App\Domains\Activity\Application\DTOs;

use Carbon\Carbon;

readonly class ActivityFilterDTO
{
    public function __construct(
        public ?string $user_id,
        public ?string $entity_type,
        public ?string $entity_id,
        public ?string $action,
        public ?Carbon $date_from,
        public ?Carbon $date_to,
        public int $per_page = 20
    ) {}
}
