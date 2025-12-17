<?php

namespace App\Domains\Core\Application\Commands;

class UpdateUserPreferenceCommand
{
    public function __construct(
        public readonly string $userId,
        public readonly string $preferenceKey,
        public readonly mixed $value,
        public readonly ?string $category = null
    ) {
    }
}
