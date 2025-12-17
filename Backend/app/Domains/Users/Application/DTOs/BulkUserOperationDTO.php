<?php

namespace App\Domains\Users\Application\DTOs;

readonly class BulkUserOperationDTO
{
    public function __construct(
        public array $user_ids,
        public string $operation,
        public array $data,
        public bool $notify = false
    ) {}
}
