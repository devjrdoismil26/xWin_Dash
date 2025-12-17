<?php

namespace App\Domains\Core\Application\DTOs;

readonly class CacheStatsDTO
{
    public function __construct(
        public int $total_keys,
        public int $memory_usage,
        public float $hit_rate,
        public array $top_keys = []
    ) {}
}
