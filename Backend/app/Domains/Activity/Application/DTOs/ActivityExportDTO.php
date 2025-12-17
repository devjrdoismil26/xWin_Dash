<?php

namespace App\Domains\Activity\Application\DTOs;

readonly class ActivityExportDTO
{
    public function __construct(
        public string $format,
        public ActivityFilterDTO $filters,
        public bool $include_metadata = true
    ) {}
}
