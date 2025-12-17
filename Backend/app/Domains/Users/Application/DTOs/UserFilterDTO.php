<?php

namespace App\Domains\Users\Application\DTOs;

use Carbon\Carbon;

readonly class UserFilterDTO
{
    public function __construct(
        public ?string $role,
        public ?string $status,
        public ?string $search,
        public ?Carbon $date_from,
        public ?Carbon $date_to
    ) {}
}
