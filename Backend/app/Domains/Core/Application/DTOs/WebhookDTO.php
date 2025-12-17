<?php

namespace App\Domains\Core\Application\DTOs;

use Carbon\Carbon;

readonly class WebhookDTO
{
    public function __construct(
        public string $event,
        public array $payload,
        public string $signature,
        public Carbon $timestamp
    ) {}
}
