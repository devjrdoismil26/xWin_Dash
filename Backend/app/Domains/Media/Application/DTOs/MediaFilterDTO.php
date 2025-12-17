<?php

namespace App\Domains\Media\Application\DTOs;

use Carbon\Carbon;

readonly class MediaFilterDTO
{
    public function __construct(
        public ?string $folder_id,
        public ?string $type,
        public array $tags = [],
        public ?Carbon $date_from = null,
        public ?Carbon $date_to = null
    ) {}
}
