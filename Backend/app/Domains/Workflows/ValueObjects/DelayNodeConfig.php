<?php

namespace App\Domains\Workflows\ValueObjects;

class DelayNodeConfig
{
    public function __construct(
        public int $delay_seconds,
    ) {
    }
}
