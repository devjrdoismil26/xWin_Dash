<?php

namespace App\Domains\Core\Application\DTOs;

readonly class SettingDTO
{
    public function __construct(
        public string $key,
        public mixed $value,
        public string $type,
        public string $group,
        public bool $is_public = false
    ) {}
}
